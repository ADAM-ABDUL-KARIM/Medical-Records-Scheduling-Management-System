import Form from "../components/Form";

function Login() {

  return (
  <>

   <div style={{ textAlign: "left ", marginTop: "50px", marginLeft: "70px" }}>
        <h1>Welcome Recruiters </h1>
        <p style={{ fontSize: "16px", color: "#555", maxWidth: "500px", margin: "10px auto" }}>
          This is a demo of my full-stack healthcare application. You can log in using the default credentials below to explore patient and admin features safely.
        </p>
        <p style={{ fontSize: "14px", color: "#777" }}>
          <strong>Admin:</strong> admin / admin<br />
          <strong>Patient:</strong> defaultUsername / defaultPassword
        </p>

        </div>
  <Form route="/api/token/" method="login" />

  </>
  );
}

export default Login;
