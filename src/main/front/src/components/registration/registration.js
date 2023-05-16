import React, {useState} from "react";

import "./registration.css";

const Registration = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = {name, email, password}
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    };
    fetch("http://localhost:8080/registration", requestOptions)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

    return (
        <form className="registration" onSubmit={handleSubmit}>

            <h2 className="text-center text-white pt-4 pb-1">Registration</h2>
            <div className="formGroup">
                <input type="text" id="name" name="name" placeholder="User Name" autoComplete="off"
                       value={name}
                       onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="formGroup">
                <input type="email" placeholder="E-mail" name="email" required autoComplete="off"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="formGroup">
                <input type="password" id="password" name="password" placeholder="Password" required autoComplete="off"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="formGroup">
                <input type="password" id="confirmPassword" placeholder="Confirm Password" autoComplete="off"/>
            </div>
            <div className="checkBox">
                <input type="checkbox" name="checkbox" id="checkbox"/>
                    <label htmlFor="checkbox" className="text">I agree with term & conditions</label>
            </div>
            <div className="formGroup">
                <button type="submit" className="btn2" onClick={handleSubmit}>REGISTER</button>
            </div>

        </form>
    )
}

export default Registration;