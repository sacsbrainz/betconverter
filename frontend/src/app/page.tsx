"use client";

import axios, { AxiosError } from "axios";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  LinkIcon,
  LoaderIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { env } from "~/env";
import { cn } from "~/lib/utils";

interface IBookie {
  name: string;
  country: string;
  countryShortCode: string;
  inputDisabled: boolean;
  outputDisabled: boolean;
}

export default function HomePage() {
  const [data, setData] = useState({
    code: "",
    input: {
      name: "",
      country: "",
      countryShortCode: "",
      inputDisabled: false,
      outputDisabled: false,
    },
    output: {
      name: "",
      country: "",
      countryShortCode: "",
      inputDisabled: false,
      outputDisabled: false,
    },
    remove: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);
  const [outputOpen, setOutputOpen] = useState(false);
  const [forceRemove, setForceRemove] = useState(false);

  const [bookiesList, setBookiesList] = useState<IBookie[] | null>(null);

  const fetchBookies = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get<{
        message: string;
        data: IBookie[];
      }>(env.NEXT_PUBLIC_API_URL + "/bookies"
      );
      if (res.data.message !== "success") {
        return toast.error("bookies list: " + res.data.message);
      }
      setBookiesList(res.data.data);
    } catch (error) {
      return toast.error("bookies list fetching failed");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    void fetchBookies();
  }, []);

  const [resData, setResData] = useState<{
    shareCode: string;
    shareURL: string;
  } | null>(null);

  const hanleSubmit = async () => {
    try {
      setIsLoading(true);
      if (
        data.input.name === data.output.name &&
        data.input.country === data.output.country
      ) {
        return toast.error("You can't convert to the same bookie");
      }
      if (data.code.length < 1) {
        return toast.error("kindly input the booking code");
      }
      if (
        data.input.countryShortCode.length < 1 ||
        data.output.countryShortCode.length < 1
      ) {
        return toast.error("kindly select code source");
      }
      if (data.input.name === "stake") {
        toast(
          `Note: This may take a bit longer and a few games may not be converted because they are not available on ${data.output.name}`,
        );
      }

      const res = await axios.post<{
        message: string;
        data: {
          shareCode: string;
          shareURL: string;
        };
      }>(env.NEXT_PUBLIC_API_URL, {
        ...data,
      });

      if (res.data.message !== "success") {
        return toast.error(res.data.message);
      }
      setResData(res.data.data);
      setForceRemove(false);
    } catch (error) {
      // console.log(error);
      console.log(data)
      if (error instanceof AxiosError) {
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error.startsWith("Unsupported bet")
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          return toast.error(error.response?.data?.error as string);
          // return toast({
          //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          //   description: error.response?.data?.error as string,
          //   variant: "destructive",
          //   action: (
          //     <Link
          //       rel="noopener noreferrer"
          //       target="_blank"
          //       className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
          //       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          //       href={`https://api.whatsapp.com/send?phone=2348028573902&text=hi%20sacs%20%F0%9F%98%92%F0%9F%98%92%2C%20i%20tried%20to%20convert%20this%20code%20%22${data.code}%22%20from%20${data.input.name}(${data.input.countryShortCode})%20to%20${data.output.name}(${data.output.countryShortCode})%20and%20got%20%22${error.response?.data?.error}%22`}
          //     >
          //       Report to dev
          //     </Link>
          //   ),
          //   duration: 10000,
          // });
        }
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error.startsWith(
            "Some markets are not available:",
          )
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          return toast.error(error.response?.data?.error as string);
          // return toast({
          //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          //   description: error.response?.data?.error as string,
          //   variant: "destructive",
          //   action: (
          //     <ToastAction
          //       onClick={() => {
          //         setData((prev) => ({ ...prev, remove: true }));
          //         setForceRemove(true);
          //         // toast({
          //         //   description:
          //         //     "Coming soon, you can remove them manually for now",
          //         // });
          //         // toast({
          //         //   description:
          //         //     "This may take a bit longer and may not work...",
          //         // })
          //       }}
          //       altText="Remove them"
          //     >
          //       Remove them
          //     </ToastAction>
          //   ),
          //   duration: 10000,
          // });
        }
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error.startsWith(
            "invalid event data, no market there",
          )
        ) {
          return toast.error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (error.response?.data?.error as string) +
            ": consider converting to msport first because it displays the exact games not available and ability to remove them, then convert from msport to your desired bookie",
          );
        }
        return toast.error(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (error.response?.data?.error as string) || "Something went wrong",
        );
      }
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const hanleSubmitWithRemove = async () => {
    try {
      setIsLoading(true);
      if (
        data.input.name === data.output.name &&
        data.input.country === data.output.country
      ) {
        return toast.error("You can't convert to the same bookie");
      }
      if (data.code.length < 1) {
        return toast.error("kindly input the booking code");
      }
      if (
        data.input.countryShortCode.length < 1 ||
        data.output.countryShortCode.length < 1
      ) {
        return toast.error("kindly select code source");
      }
      if (data.input.name === "stake") {
        toast(
          `Note: This may take a bit longer and a few games may not be converted because they are not available on ${data.output.name}`,
        );
      }

      const res = await axios.post<{
        message: string;
        data: {
          shareCode: string;
          shareURL: string;
        };
      }>(env.NEXT_PUBLIC_API_URL, {
        ...data,
      });

      if (res.data.message !== "success") {
        return toast.error(res.data.message);
      }
      setResData(res.data.data);
      setForceRemove(false);
    } catch (error) {
      // console.log(error);
      if (error instanceof AxiosError) {
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error.startsWith("Unsupported bet")
        ) {
          return toast.error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            error.response?.data?.error as string,
          );
          // return toast({
          //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          //   description: error.response?.data?.error as string,
          //   variant: "destructive",
          //   action: (
          //     <Link
          //       rel="noopener noreferrer"
          //       target="_blank"
          //       className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
          //       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          //       href={`https://api.whatsapp.com/send?phone=2348028573902&text=hi%20sacs%20%F0%9F%98%92%F0%9F%98%92%2C%20i%20tried%20to%20convert%20this%20code%20%22${data.code}%22%20from%20${data.input.name}(${data.input.countryShortCode})%20to%20${data.output.name}(${data.output.countryShortCode})%20and%20got%20%22${error.response?.data?.error}%22`}
          //     >
          //       Report to dev
          //     </Link>
          //   ),
          //   duration: 10000,
          // });
        }
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error.startsWith(
            "Some markets are not available:",
          )
        ) {
          return toast.error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            error.response?.data?.error as string,
          );
        }
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error.startsWith(
            "invalid event data, no market there",
          )
        ) {
          return toast.error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (error.response?.data?.error as string) +
            ": consider converting to msport first because it displays the exact games not available and ability to remove them, then convert from msport to your desired bookie",
          );
        }
        return toast.error(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (error.response?.data?.error as string) ?? "Something went wrong",
        );
      }
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background antialiased">
      <div className="absolute right-0 top-8 flex items-center">
        <Link
          className="mr-2 flex gap-2 rounded-lg bg-green-200 px-2 py-1 dark:bg-gray-800"
          target="_blank"
          href="https://github.com/sacsbrainz/betconverter"
          aria-label="Star sacsbrainz/betconverter on GitHub"
        >
          contribute
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"></path>
          </svg>
        </Link>

        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center justify-center gap-8 px-4 lg:container lg:py-16">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Hey <span className="text-[hsl(280,100%,70%)]">Data Analyst</span>👋
        </h1>
        <div>
          <p> Enter Booking Code:</p>
          <input
            onChange={(e) => {
              setData((prev) => ({ ...prev, code: e.target.value }));
            }}
            value={data.code}
            className="w-[250px] rounded-md border-2 px-2 py-1"
            type="text"
          />
        </div>
        <div className="">
          <p>From:</p>
          <Popover open={inputOpen} onOpenChange={setInputOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                onClick={() => {
                  setInputOpen(!inputOpen);
                }}
                className="w-[250px] justify-between capitalize"
              >
                {data.input.name
                  ? `${data.input.name} ${data.input.country.toLowerCase() === "global"
                    ? ""
                    : data.input.country
                  }`
                  : "Select Source..."}

                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
              <Command>
                <CommandInput placeholder="Search source..." />
                <CommandList>
                  <CommandEmpty className="flex flex-col items-center p-4">
                    No Source found.
                    <Button
                      variant="outline"
                      onClick={async () => {
                        await fetchBookies();
                      }}
                    >
                      fetch data
                    </Button>
                  </CommandEmpty>
                  <CommandGroup className="max-h-32 overflow-y-scroll">
                    {bookiesList?.map((bookie, index) => (
                      <CommandItem
                        className={cn(
                          "capitalize",
                          bookie.inputDisabled && "text-muted-foreground",
                        )}
                        key={index}
                        disabled={bookie.inputDisabled}
                        value={JSON.stringify(bookie)}
                        onSelect={(currentValue) => {
                          setResData(null);

                          const currentValueTransformed = JSON.parse(
                            currentValue,
                          ) as {
                            name: string;
                            country: string;
                            countryShortCode: string;
                            inputDisabled: boolean;
                            outputDisabled: boolean;
                          };

                          // Create a new object with the desired keys
                          const transformedData = {
                            name: currentValueTransformed.name,
                            country: currentValueTransformed.country,
                            countryShortCode:
                              currentValueTransformed.countryShortCode,
                            inputDisabled: currentValueTransformed.inputDisabled,
                            outputDisabled:
                              currentValueTransformed.outputDisabled,
                          };

                          setData((prev) => ({
                            ...prev,
                            input: transformedData,
                          }));
                          setInputOpen(!inputOpen);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            data.input.name.toLowerCase() ===
                              bookie.name.toLowerCase() &&
                              data.input.country.toLowerCase() ===
                              bookie.country.toLowerCase()
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {bookie.name}{" "}
                        {bookie.country.toLowerCase() === "global"
                          ? ""
                          : bookie.country}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <p>To:</p>
          <Popover open={outputOpen} onOpenChange={setOutputOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                onClick={() => {
                  setOutputOpen(!outputOpen);
                }}
                className="w-[250px] justify-between capitalize"
              >
                {data.output.name
                  ? `${data.output.name} ${data.output.country.toLowerCase() === "global"
                    ? ""
                    : data.output.country
                  }`
                  : "Select Source..."}

                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
              <Command>
                <CommandInput placeholder="Search source..." />
                <CommandList>
                  <CommandEmpty className="flex flex-col items-center p-4">
                    No Source found.
                    <Button
                      variant="outline"
                      onClick={async () => {
                        await fetchBookies();
                      }}
                    >
                      fetch data
                    </Button>
                  </CommandEmpty>
                  <CommandGroup className="max-h-32 overflow-y-scroll">
                    {bookiesList?.map((bookie, index) => (
                      <CommandItem
                        className={cn(
                          "capitalize",
                          bookie.outputDisabled && "text-muted-foreground",
                        )}
                        key={index}
                        disabled={bookie.outputDisabled}
                        value={JSON.stringify(bookie)}
                        onSelect={(currentValue) => {
                          setResData(null);

                          const currentValueTransformed = JSON.parse(
                            currentValue,
                          ) as {
                            name: string;
                            country: string;
                            countryShortCode: string;
                            inputDisabled: boolean;
                            outputDisabled: boolean;
                          };

                          // Create a new object with the desired keys
                          const transformedData = {
                            name: currentValueTransformed.name,
                            country: currentValueTransformed.country,
                            countryShortCode:
                              currentValueTransformed.countryShortCode,
                            inputDisabled: currentValueTransformed.inputDisabled,
                            outputDisabled:
                              currentValueTransformed.outputDisabled,
                          };

                          setData((prev) => ({
                            ...prev,
                            output: transformedData,
                          }));
                          setOutputOpen(!outputOpen);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            data.output.name.toLowerCase() ===
                              bookie.name.toLowerCase() &&
                              data.output.country.toLowerCase() ===
                              bookie.country.toLowerCase()
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {bookie.name}{" "}
                        {bookie.country.toLowerCase() === "global"
                          ? ""
                          : bookie.country}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {resData && (
          <div className="flex flex-col items-center gap-5">
            <p>
              {data.output.name}-{data.output.countryShortCode}:{" "}
              {resData.shareCode}
            </p>
            <button
              onClick={() => {
                if (!navigator.clipboard) {
                  // Clipboard API not available
                  return;
                }
                if (data.output.name.toLowerCase() === "msport") {
                  void navigator.clipboard
                    .writeText(
                      `https://www.msport.com/${data.output.countryShortCode}?code=${resData.shareCode}`,
                    )
                    .then(() => {
                      toast.success("Copied to clipboard");
                    });
                  return;
                }
                void navigator.clipboard
                  .writeText(resData.shareURL)
                  .then(() => {
                    toast.success("Copied to clipboard");
                  });
              }}
              className="flex h-4 items-center gap-2"
            >
              Link:
              <LinkIcon className="h-4" />
            </button>
          </div>
        )}
        <div>
          {forceRemove ? (
            <button
              disabled={isLoading}
              onClick={hanleSubmitWithRemove}
              className="rounded-md border-2 px-4 py-1 disabled:opacity-40"
            >
              Force Convert
              {isLoading && <LoaderIcon className="ml-2 inline animate-spin" />}
            </button>
          ) : (
            <button
              disabled={isLoading}
              onClick={hanleSubmit}
              className="rounded-md border-2 px-4 py-1 disabled:opacity-40"
            >
              Convert{" "}
              {isLoading && <LoaderIcon className="ml-2 inline animate-spin" />}
            </button>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 pb-2 text-sm">
        Made with love❤️ by{" "}
        <Link
          rel="noopener noreferrer"
          target="_blank"
          className="inline-block text-[hsl(280,100%,70%)]"
          href="https://api.whatsapp.com/send/?phone=2348028573902&text=from+your+website+betconvert.sacsbrainz.com&app_absent=0"
        >
          sascbrainz
        </Link>
      </div>
    </main>
  );
}
