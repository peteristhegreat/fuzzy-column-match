import Image from "next/image";
import { Inter } from "next/font/google";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { generateOutputColumn } from "@/utils/fuzzySearch";
import { range } from "lodash";

type Inputs = {
  vlookupColumn: string;
  inputColumn: string;
  threshold: number;
  rows: number;
};

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [outputColumn, setOutputColumn] = useState("");
  const [closeMatches, setCloseMatches] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    console.log("Data in");
    // @ts-ignore
    const threshold = parseInt(data.threshold);

    const [oc, cm] = generateOutputColumn(
      data.vlookupColumn.trim().split("\n"),
      data.inputColumn.trim().split("\n"),
      threshold
    );
    console.log({ oc, cm });
    setOutputColumn("1234");
    setCloseMatches("57689")
    setOutputColumn(oc.join("\n"));
    const sortedMatches : string[] = [];
    range(threshold, Math.min(60, Math.max(threshold - 10, 1)), -1).forEach(
      (val) => {
        if (cm[val]) {
          // @ts-ignore
          cm[val].forEach(([s1, s2]: [string, string]) => {
            sortedMatches.push(`${val} - "${s1}" ~ "${s2}"`);
          });
        }
      }
    );
    setCloseMatches(sortedMatches.join("\n"));
  };

  const rows = watch("rows", 4);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <div className="m-3 prose">
          <h1>Fuzzy Column Match</h1>
          <p>This uses <a href="https://github.com/nol13/fuzzball.js">fuzzball.js</a>{" "}
          aka{" "}
          <a href="https://en.wikipedia.org/wiki/Levenshtein_distance">
            Levenshtein Distance
          </a>{" "}
          calculations to match up values.</p>
          <p>The input column will be one to one to the output column in row count.</p>
        </div>
        <div className="flex">
          <div className="m-3">
            <label
              htmlFor="vlookup-column"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Lookup Column
            </label>
            <textarea
              id="vlookup-column"
              placeholder="Lookup Column"
              rows={rows || 4}
              className="whitespace-pre block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register("vlookupColumn")}
            />
            {errors["vlookupColumn"] && <span>This field is required</span>}
          </div>

          {/* include validation with required or other standard HTML validation rules */}
          <div className="m-3">
            <label
              htmlFor="input-column"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Input Column
            </label>
            <textarea
              id="input-column"
              placeholder="Input Column"
              rows={rows || 4}
              className="whitespace-pre block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register("inputColumn", { required: true })}
            />
            {/* errors will return when field validation fails  */}
            {errors["inputColumn"] && <span>This field is required</span>}
          </div>

          <div className="m-3">
            <label
              htmlFor="input-column"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Output Column
            </label>
            <textarea
              id="output-column"
              placeholder="output Column"
              rows={rows || 4}
              className="whitespace-pre block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={outputColumn}
            />
          </div>

          <div className="p-2">
            <span className="mb-4">
              <label
                htmlFor="threshold"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Threshold
              </label>
              <input
                type="number"
                id="threshold"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="90"
                defaultValue={90}
                required
                {...register("threshold", { required: true })}
              />
            </span>

            <span className="mb-3">
              <label
                htmlFor="rows"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Rows
              </label>
              <input
                type="number"
                id="rows"
                placeholder="4 (Optional)"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("rows")}
              />
            </span>
          </div>

          <button
            type="submit"
            className="m-3 mt-10 h-12 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Go
          </button>
        </div>

        <div className="m-3">
          <label
            htmlFor="close-matches"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Closest Matches
          </label>
          <textarea
            id="close-matches"
            placeholder="Values nearly matching under the threshold"
            rows={rows || 4}
            className="whitespace-pre block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={closeMatches}
          />
        </div>
      </form>
      <div className="relative flex place-items-center">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
          src="/bear.svg"
          alt="Fuzzy Bear"
          width={50}
          height={37}
          priority
        />
      </div>
    </main>
  );
}
