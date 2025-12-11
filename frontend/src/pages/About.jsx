import axios from "axios";

function About() {
  const fetchData = async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    console.log(res.data);
  };

  return (
    <>
      <h1>About Page</h1>
      <button onClick={fetchData}>Fetch API</button>
    </>
  );
}

export default About;
