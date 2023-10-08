import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { MdOutlineSearch } from "react-icons/md";
import LoadingSpinner from "../../components/LoadingSpinner";

import "tailwindcss/tailwind.css";

export default function Index() {
  const router = useRouter();

  const [shuffle, setShuffle] = useState(true);
  const [random, setRandom] = useState(false);
  const [challenge, setChallenge] = useState(false);

  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownVisibility(!isDropdownVisible);
  };

  const handleDocumentClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisibility(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    fetch("/api/quizFiles")
      .then((response) => response.json())
      .then((data) => setFiles(Array.isArray(data.files) ? data.files : []))
      .catch(() => setError(true));

    if (files.length == 0) {
      setError(true);
    }
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      setError(false);
    }
  }, [files]);

  const handleFileSelect = (fileKey) => {
    setSelectedFile(fileKey);
    toggleDropdown();
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredFiles = files.filter((file) => {
    const fileKey = Object.keys(file)[0];
    return file[fileKey].toLowerCase().includes(searchValue.toLowerCase());
  });

  const handleSubmit = (event) => {
    if (selectedFile == null) {
      alert("Please select a test");
      return;
    }

    router.push(
      `/quiz/${selectedFile}/1?shuffle=${
        shuffle ? "true" : "false"
      }&random=${random ? "true" : "false"}&challenge=${
        challenge ? "true" : "false"
      }`
    );
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center dark:bg-darkmode-1000">
      {error ? (
        <LoadingSpinner />
      ) : (
        <div className="relative flex flex-col items-center space-y-16">
          <div
            className="realtive max[640px]:mt-[7.5rem] flex flex-col items-center space-y-12"
            ref={dropdownRef}
          >
            <button
              id="dropdownSearchButton"
              onClick={toggleDropdown}
              data-dropdown-toggle="dropdownSearch"
              data-dropdown-placement="bottom"
              className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              {selectedFile
                ? files.find((file) => Object.keys(file)[0] === selectedFile)[
                    selectedFile
                  ]
                : "Select test"}
              <svg
                className="ml-2 h-4 w-4"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            <div
              id="dropdownSearch"
              className={`absolute z-10 w-60 rounded-lg bg-gray-200 shadow dark:bg-darkmode-800 ${
                isDropdownVisible ? "" : "hidden"
              }`}
            >
              <div className="p-3">
                <label htmlFor="input-group-search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdOutlineSearch />
                  </div>
                  <input
                    type="text"
                    id="input-group-search"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-darkmode-300 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Search test"
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <ul
                className="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownSearchButton"
              >
                {filteredFiles.map((file, index) => {
                  const fileKey = Object.keys(file)[0];
                  return (
                    <li key={index} onClick={() => handleFileSelect(fileKey)}>
                      <div className="flex cursor-pointer items-center rounded pl-2 hover:bg-gray-100 dark:hover:bg-darkmode-300">
                        <span className="ml-2 w-full rounded py-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          {file[fileKey]}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Start
          </button>
          <div className="flex max-[640px]:flex-col min-[640px]:space-x-4">
            <label className="relative inline-flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-200 hover:dark:bg-darkmode-600">
              <div className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  value={shuffle}
                  onChange={() => setShuffle(!shuffle)}
                  checked={shuffle}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-400 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-darkmode-100 after:pt-2 after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Shuffle
                </span>
              </div>
            </label>
            <br />
            <label className="relative inline-flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-200 hover:dark:bg-darkmode-600">
              <div className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  onChange={() => setRandom(!random)}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-400 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-darkmode-100 after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Random
                </span>
              </div>
            </label>
            <br />
            <label className="relative inline-flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-200 hover:dark:bg-darkmode-600">
              <div className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  onChange={() => setChallenge(!challenge)}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-400 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-darkmode-100 after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Challenge
                </span>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
