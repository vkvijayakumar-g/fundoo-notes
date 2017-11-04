function validateMail()
{
  var validEmail=emailvalidation(email);
  if(validEmail)
  {
    $.ajax({
        url:'/verifyUser',
        type:'POST',
        data:{
          'email':validEmail
        }
      }).done(function(data)
      {
        if(data=='Exists')
        {
          document.getElementById('error-container').innerHTML='Email is already taken.';
        }
        if(data=='done')
        {
          document.getElementById('error-container').innerHTML='Email Verification Link is Sent';
        }
    })
  }

}
function validateUsername(username)
{
  if (username.length == 0) {
    document.getElementById("error-container").innerHTML = "Not valid user name! ";
  } else if (username.length < 5) {
    document.getElementById("error-container").innerHTML = "Username should contain 5 Characters!";
  } else if (/^[a-zA-Z0-9- ]*$/.test(username) == false) {
    document.getElementById("error-container").innerHTML = "Username contains illegal characters!";
  }
  else {
    return username;
  }
}
function validatePassword(password,confirmpassword)
{

  var pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,8}$/;
  if (password.length == 0)
  {
      document.getElementById("error-container").innerHTML = "Not valid password!";
  }
  else if (password.length < 6)
  {
      document.getElementById("error-container").innerHTML = "Password length minimum 6 characters!";
  }
  else if (!pattern.test(password))
  {
      document.getElementById("error-container").innerHTML = "Password should contain atleast one number and one special character!";
  }
   else if (password!=confirmpassword)
   {
    document.getElementById("error-container").innerHTML = "Password Does Not Match";
  }
  else {
    return password;
  }
}
function emailvalidation(email)
{
  var email=$('#email').val()
  var pattern=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(pattern.test(email)==false)
  {
    document.getElementById("error-container").innerHTML = "Invalid Email-ID!";
  }
  if(pattern.test(email)==true)
  {
    return email;
  }
}
function setPassword(id)
{
  var username=validateUsername($('#username').val());
  var password = validatePassword($('#pwd').val(),$('#confirmpwd').val());
  var otp=$('#otp').val()
  $.ajax({
      url:'/updateUser',
      type:'POST',
      dataType:'JSON',
      data:{
        'id':id,
        'username':username,
        'password':password,
        'otp':otp
      }
  }).done(function(data)
  {
    if (data.status==null) {
      document.getElementById('error-container').innerHTML='Invalid OTP!';
    }
    else if (data.status == 'expired')
    {
    document.getElementById('error-container').innerHTML='OTP Expired !';
    }
    if(data.status=='done')
    {
    document.getElementById('error-container').innerHTML='Account Created !';
    }
  })
}
