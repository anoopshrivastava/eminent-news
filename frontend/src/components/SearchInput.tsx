import React from "react";
import { FaSearch } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  isLoading = false,
  placeholder = "Search...",
}) => {
  return (
    <div className="flex items-center border rounded-lg p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
      <FaSearch className="text-gray-500 mr-2 text-lg" />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 outline-none bg-transparent text-base"
      />

      {isLoading ? (
        <ImSpinner2 className="animate-spin text-gray-500 text-lg ml-2" />
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            onClear();
          }}
          className="ml-2 text-sm font-semibold cursor-pointer text-gray-500 hover:text-[#f40607]"
          aria-label="clear search"
        >
          ╳
        </button>
      )}
    </div>
  );
};

export default SearchInput;
