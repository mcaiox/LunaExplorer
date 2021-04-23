//import all components and utils and style needed for container component
import React, { useState, useEffect } from "react";
import "./style.css";
import Table from "../Table";
import TableHead from "../TableHead";
import TableBody from "../TableBody";
import TableBodyItem from "../TableBodyItem";
import Row from "../Row";
import Btn from "../Btn";
import Search from "../Search";
import useDebounce from "../../utils/DebounceUser";
import axios from "axios";

function Container() {
  //users holds array of user objects from api and when api is filtered and sorted
  //searchedUser holds string typed into Search component/
  //buttonText holds default text of button and is changed when button is clicked (changes to "Reset" and back to "Alphabetize" when "Reset" is clicked)
  const [users, setUsers] = useState([]);
  const [searchedUser, setSearchedUser] = useState("");
  const [buttonText, setButtonText] = useState("Alphabetize");
  // const [employee, setEmployee] = useState([]);
  const placeholderImage =
    "https://icon-library.net/images/default-profile-icon/default-profile-icon-8.jpg";
  //seperate function that loads users from api and saves it to state as an array
  function loadUsers() {
    //axios.get('http://localhost:8080/employees').
    axios
      .get("https://and-apollo-slackbot.herokuapp.com/employees")
      .then((res) => {
        console.log("res");
        console.log(res.data);
        setUsers(res.data);
        console.log(users);
      })
      .catch((err) => console.log(err));
  }
  //holds the custom hook that uses the typed input and set delay amount that filters through current state array
  const debouncedInput = useDebounce(searchedUser, 300);

  //The if conditional only occurs when the there is a debouncedInput, the else conditional still happens, loading the users from the api
  useEffect(() => {
    if (debouncedInput) {
      console.log(debouncedInput);
      filterAPI();
    } else {
      loadUsers();
    }
  }, [debouncedInput]);

  let counter = 0;

  //filter out object from api array that matches the searchedUser(typed input in search)
  //filter from api so the user doesn't need to backspace all the way (and let state reload with all users) before changing input
  function filterAPI() {
    // axios.get('http://localhost:8080/employees')
    axios
      .get("https://and-apollo-slackbot.herokuapp.com/employees")
      .then((res) => {
        const response = res.data;

        console.log(response);
        const employee = response.filter((name) => {
          counter++;
          console.log("filter has been hit this: " + counter + " many times");
          console.log(name);
          const first = name.firstName.toLocaleLowerCase();
          console.log(first);
          const last = name.lastName.toLocaleLowerCase();
          console.log(last);
          const lowerCaseSearchedUser = searchedUser.toLocaleLowerCase();
          console.log(lowerCaseSearchedUser);
          const full = `${first} ${last}`;
          console.log(full);
          const fullOriginal = `${name.firstName} ${name.lastName}`;
          console.log("full original :" + fullOriginal);
          //'includes' method compares any piece of name to string (from object) so that if user only knows a part of the employee's name the api will still be called
          //compares input to object whether the user types in all lower case or capitalizes the first letter
          if (full.includes(lowerCaseSearchedUser)) {
            console.log("if full includes lcsu: ");
            return true;
          } else if (fullOriginal.includes(searchedUser)) {
            console.log("if full  original includes searchedUser: ");
            return true;
          }
        });
        setUsers(employee);
      });
  }

  //grabs value in input and saves it to state
  const handleInputChange = (e) => {
    const value = e.target.value;
    //console.log(value);
    setSearchedUser(value);
  };
  //when button is clicked, sort state array alphabetically and text of button changes
  //to unalphabetize state array, click "reset" and it sets button text back to alphabetize
  const changeButtonText = (e) => {
    e.preventDefault();

    if (buttonText === "Alphabetize") {
      setButtonText("Reset");
      const sortUsers = users.sort((a, b) =>
        a.lastName.localeCompare(b.lastName)
      );
      setUsers(sortUsers);
    } else if (buttonText === "Reset") {
      setButtonText("Alphabetize");
      loadUsers();
    }
  };

  //a function that splits the dob to only get the month day and year and then call it in map
  function splitDob(str) {
    return str.slice(0, 10);
  }

  //returns components
  return (
    <div className="container">
      <Row>
        <Search handleInputChange={handleInputChange} value={searchedUser} />
        <Btn changeButtonText={changeButtonText} text={buttonText} />
      </Row>
      <Table>
        <TableHead />
        <TableBody>
          {console.log(users)}
          {users.map((user) => (
            <TableBodyItem
              picture={user.picture ? user.picture : placeholderImage}
              //"data:image/png;base64,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"

              key={user.email}
              name={`${user.firstName} ${user.lastName}`}
              //employeeID={user.employeeID}
              email={user.email}
              club={user.club}
              skills={user.skills}
              //newSkill={user.newSkill}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Container;
