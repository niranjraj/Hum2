import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { CgArrowLeft } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";
import { useAppDispatch, useAppSelector } from "../redux/redux-hook";
import { setErrorSignValue } from "../redux/util-slice";

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const signError = useAppSelector((state) => state.util.errorSign);
  const handleSignIn = async () => {
    try {
      console.log("logging in");
      await signIn("google", { callbackUrl: "/account" });
    } catch (err) {
      console.error("Sign in failed:", err);
      dispatch(setErrorSignValue("Sign in failed"));
    }
  };
  return (
    <div className="login-container">
      <div className="login-content-wrapper">
        <div className="login-content">
          <h2>Log in</h2>
          <p>Welcome back! Please sign in to continue</p>
          <div className="login-btn-wrapper">
            <button className="google-btn" onClick={() => handleSignIn()}>
              <FcGoogle /> <p>Sign in with Google</p>
            </button>
            <Link href="/" className="login-back-btn">
              <CgArrowLeft />
              Back
            </Link>
          </div>
          {signError && <div className="error-sign-wrapper">{signError}</div>}
        </div>
        <div className="login-img-wrapper"></div>
      </div>
    </div>
  );
};

export default Home;
