const register = async (userData:any) => {

    const response = await fetch("/api/signup", {
        method: "POST",
        body: userData,
        headers: {"Content-Type": "application/json"},
    });

    const responseData = await response.json();

    if (!!responseData.token) {
      localStorage.setItem('user', JSON.stringify(responseData))
      return responseData;
    }
    else{
      throw Error(responseData.message);
    }
}

const logout = () => {
  localStorage.removeItem('user');
}

const login = async (userData:any) => {
    const response = await fetch("/api/login", {
      method: "POST",
      body: userData,
      headers: {"Content-Type": "application/json"},
  });

  const responseData = await response.json();

  if (!!responseData.token) {
    localStorage.setItem('user', JSON.stringify(responseData))
    return responseData;
  }
  else{
    throw Error(responseData.message);
  }
  
}


  const authService = {
    register,
    logout,
    login
  }
  
  export default authService