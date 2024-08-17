import "./App.css";
import Header from "./Header";
import Wallet from "./Wallet";

function App() {
  return (
    <div className="p-5 w-full flex flex-col justify-center">
      <div className="p-8 w-full">
        <Header />
      </div>
      <div className="w-full">
        <Wallet />
      </div>
    </div>
  );
}

export default App;
