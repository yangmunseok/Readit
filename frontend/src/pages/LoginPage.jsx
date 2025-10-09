import React, { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export const LoginPage = () => {
  const { login, signup } = useAuthStore();
  const [hasAccount, setHasAccount] = useState(true);
  const formRef = useRef(null);

  useEffect(() => {
    const height = formRef.current.getBoundingClientRect().height;
    const offsetTop = formRef.current.offsetTop;
    const y = offsetTop - (window.innerHeight - height) / 2;
    window.scrollTo(0, y);
  }, [formRef]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");
    const nickname = form.get("nickname");
    hasAccount
      ? login({ email, password })
      : signup({ email, password, nickname });
  };
  return (
    <div className="relative flex min-h-svh lg:min-h-screen w-full items-center justify-center aspect-square bg-white/55 bg-[url(/img/Background.jpg)] bg-blend-overlay bg-cover bg-bottom">
      <form
        onSubmit={submitHandler}
        className="relative flex flex-col bg-stone-100 shadow-2xl w-xs sm:w-sm md:w-md lg:w-lg p-10 z-10"
        ref={formRef}
      >
        <p className="text-center font-black text-2xl m-5">Readit</p>
        <label htmlFor="emali" className="block text-stone-400 mb-1 text-sm">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="peer/email w-full rounded-sm bg-stone-100 outline-none ring-1 ring-stone-300 focus:ring-2 focus:valid:ring-green-500 h-10 invalid:ring-2 invalid:ring-red-500"
        />
        <p className="invisible peer-invalid/email:visible text-red-900 text-sm">
          Please provide a valid email address.
        </p>
        <label
          htmlFor="password"
          className="block text-stone-400 mb-1 mt-2 text-sm"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          minLength={8}
          className="peer/password w-full rounded-sm bg-stone-100 outline-none ring-1 ring-stone-300 focus:ring-2 focus:valid:ring-green-500 h-10 invalid:ring-2 invalid:ring-red-500"
        />
        <p className="invisible peer-invalid/password:visible text-red-900 text-sm">
          Your password must be at least 8 characters long.
        </p>
        {!hasAccount && (
          <>
            <label
              htmlFor="password"
              className="block text-stone-400 mb-1 mt-2 text-sm"
            >
              Nickname
            </label>
            <input
              type="text"
              name="nickname"
              className="w-full rounded-sm bg-stone-100 outline-none ring-1 ring-stone-300 focus:ring-2 focus:ring-green-500 h-10"
            />
          </>
        )}
        <br />
        <button
          type="submit"
          className="block text-center  bg-green-500 hover:bg-green-600 text-white rounded-md m-5 p-2 font-bold text-lg"
        >
          {hasAccount ? "Login" : "Signin"}
        </button>
        {hasAccount && (
          <>
            {" "}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <a
              href="/api/auth/google"
              className="p-2 rounded-lg border border-stone-300 hover:bg-stone-200 text-center"
            >
              <FcGoogle className="size-10 inline" />
              <span className="font-bold ml-3">Login with Google</span>
            </a>
          </>
        )}
        <p
          className="text-stone-500 m-5 hover:underline self-center"
          onClick={() => setHasAccount(!hasAccount)}
        >
          {hasAccount ? "Doesn't have any account?" : "Login?"}
        </p>
      </form>
    </div>
  );
};
