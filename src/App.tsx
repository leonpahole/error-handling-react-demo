import { LoginForm as LoginFormStandardErrorHandling } from "./components/loginForm/LoginFormStandardErrorHandling";
import { LoginForm } from "./components/loginForm/LoginForm";
import "./util/rest/rest-mock.ts";

function App() {
  return (
    <main>
      <LoginForm />
      <hr />
      <LoginFormStandardErrorHandling />
    </main>
  );
}

export default App;
