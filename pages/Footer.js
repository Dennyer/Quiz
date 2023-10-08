const Footer = () => {
  return (
    <footer className="mt-24 px-4 py-6 sm:px-6">
      <div className="text-center text-sm text-gray-500">
        <span className="mr-2 text-lg font-bold text-gray-900 dark:text-gray-100">
          {" "}
          Next.js Dev
        </span>{" "}
        &copy; {new Date().getFullYear()} All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
