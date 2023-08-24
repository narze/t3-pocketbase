import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import { useState } from "react";

export default function NewPost() {
  const router = useRouter();
  const { mutate, error } = api.post.createPost.useMutation({
    onSuccess: (data) => {
      void router.push(`/posts/${data.id}`);
    },
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["optionA", "optionC"]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({ title, description, options });
  };

  if (error) {
    return <>An error occurred {error.message}</>;
  }

  return (
    <main className="container mx-auto space-y-4">
      <Link href="/" className="text-blue-500 hover:text-blue-700">
        Back
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="options" className="block font-medium text-gray-700">
            Options
          </label>
          <div className="mt-2 flex flex-col space-y-2">
            <label htmlFor="optionA" className="flex items-center">
              <input
                type="checkbox"
                id="optionA"
                value="optionA"
                checked={options.includes("optionA")}
                onChange={(e) =>
                  setOptions((prevOptions) =>
                    e.target.checked
                      ? [...prevOptions, e.target.value]
                      : prevOptions.filter(
                          (option) => option !== e.target.value
                        )
                  )
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Option A</span>
            </label>
            <label htmlFor="optionB" className="flex items-center">
              <input
                type="checkbox"
                id="optionB"
                value="optionB"
                checked={options.includes("optionB")}
                onChange={(e) =>
                  setOptions((prevOptions) =>
                    e.target.checked
                      ? [...prevOptions, e.target.value]
                      : prevOptions.filter(
                          (option) => option !== e.target.value
                        )
                  )
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Option B</span>
            </label>
            <label htmlFor="optionC" className="flex items-center">
              <input
                type="checkbox"
                id="optionC"
                value="optionC"
                checked={options.includes("optionC")}
                onChange={(e) =>
                  setOptions((prevOptions) =>
                    e.target.checked
                      ? [...prevOptions, e.target.value]
                      : prevOptions.filter(
                          (option) => option !== e.target.value
                        )
                  )
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Option C</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Post
          </button>
        </div>
      </form>
    </main>
  );
}
