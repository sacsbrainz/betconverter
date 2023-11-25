import axios, { AxiosError } from "axios";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  LinkIcon,
  LoaderIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import Bookies from "~/data";
import { env } from "~/env.mjs";
import { fontPoppins } from "~/lib/fonts";
import { cn } from "~/lib/utils";

export default function Home() {
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

  const [resData, setResData] = useState<{
    shareCode: string;
    shareURL: string;
  } | null>(null);
  const { toast } = useToast();

  const hanleSubmit = async () => {
    try {
      setIsLoading(true);
      if (
        data.input.name === data.output.name &&
        data.input.country === data.output.country
      ) {
        return toast({
          description: "You can't convert to the same bookie",
          variant: "destructive",
        });
      }
      if (data.code.length < 1) {
        return toast({
          description: "kindly input the booking code",
          variant: "destructive",
        });
      }
      if (
        data.input.countryShortCode.length < 1 ||
        data.output.countryShortCode.length < 1
      ) {
        return toast({
          description: "kindly select code source",
          variant: "destructive",
        });
      }
      if (data.input.name === "stake") {
        toast({
          description: `Note: This may take a bit longer and a few games may not be converted because they are not available on ${data.output.name}`,
        });
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
        return toast({
          description: res.data.message,
          variant: "destructive",
        });
      }
      setResData(res.data.data);
      setForceRemove(false)
    } catch (error) {
      // console.log(error);
      if (error instanceof AxiosError) {
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error.startsWith("Unsupported bet")
        ) {
          return toast({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            description: error.response?.data?.error as string,
            variant: "destructive",
            action: (
              <Link
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                href={`https://api.whatsapp.com/send?phone=2348028573902&text=hi%20sacs%20%F0%9F%98%92%F0%9F%98%92%2C%20i%20tried%20to%20convert%20this%20code%20%22${data.code}%22%20from%20${data.input.name}(${data.input.countryShortCode})%20to%20${data.output.name}(${data.output.countryShortCode})%20and%20got%20%22${error.response?.data?.error}%22`}
              >
                Report to dev
              </Link>
            ),
            duration: 10000,
          });
        }
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error.startsWith(
            "Some markets are not available:",
          )
        ) {
          return toast({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            description: error.response?.data?.error as string,
            variant: "destructive",
            action: (
              <ToastAction
                onClick={() => {
                  setData((prev) => ({ ...prev, remove: true }));
                  setForceRemove(true);
                  // toast({
                  //   description:
                  //     "Coming soon, you can remove them manually for now",
                  // });
                  // toast({
                  //   description:
                  //     "This may take a bit longer and may not work...",
                  // })
                }}
                altText="Remove them"
              >
                Remove them
              </ToastAction>
            ),
            duration: 10000,
          });
        }
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error.startsWith(
            "invalid event data, no market there",
          )
        ) {
          return toast({
            description:
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              (error.response?.data?.error as string) +
              ": consider converting to msport first because it displays the exact games not available and ability to remove them, then convert from msport to your desired bookie",
            variant: "destructive",

            duration: 10000,
          });
        }
        return toast({
          description:
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (error.response?.data?.error as string) ?? "Something went wrong",
          variant: "destructive",
        });
      }
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
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
        return toast({
          description: "You can't convert to the same bookie",
          variant: "destructive",
        });
      }
      if (data.code.length < 1) {
        return toast({
          description: "kindly input the booking code",
          variant: "destructive",
        });
      }
      if (
        data.input.countryShortCode.length < 1 ||
        data.output.countryShortCode.length < 1
      ) {
        return toast({
          description: "kindly select code source",
          variant: "destructive",
        });
      }
      if (data.input.name === "stake") {
        toast({
          description: `Note: This may take a bit longer and a few games may not be converted because they are not available on ${data.output.name}`,
        });
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
        return toast({
          description: res.data.message,
          variant: "destructive",
        });
      }
      setResData(res.data.data);
      setForceRemove(false)
    } catch (error) {
      // console.log(error);
      if (error instanceof AxiosError) {
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error.startsWith("Unsupported bet")
        ) {
          return toast({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            description: error.response?.data?.error as string,
            variant: "destructive",
            action: (
              <Link
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                href={`https://api.whatsapp.com/send?phone=2348028573902&text=hi%20sacs%20%F0%9F%98%92%F0%9F%98%92%2C%20i%20tried%20to%20convert%20this%20code%20%22${data.code}%22%20from%20${data.input.name}(${data.input.countryShortCode})%20to%20${data.output.name}(${data.output.countryShortCode})%20and%20got%20%22${error.response?.data?.error}%22`}
              >
                Report to dev
              </Link>
            ),
            duration: 10000,
          });
        }
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error.startsWith(
            "Some markets are not available:",
          )
        ) {
          return toast({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            description: error.response?.data?.error as string,
            variant: "destructive",

            duration: 10000,
          });
        }
        if (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error.startsWith(
            "invalid event data, no market there",
          )
        ) {
          return toast({
            description:
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              (error.response?.data?.error as string) +
              ": consider converting to msport first because it displays the exact games not available and ability to remove them, then convert from msport to your desired bookie",
            variant: "destructive",

            duration: 10000,
          });
        }
        return toast({
          description:
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (error.response?.data?.error as string) ?? "Something went wrong",
          variant: "destructive",
        });
      }
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className={cn(
        "font-poppins-400 flex min-h-screen flex-col items-center justify-center bg-background antialiased ",
        fontPoppins.variable,
      )}
    >
      <div className=" absolute right-0 top-8">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center justify-center gap-8 px-4 lg:container lg:py-16 ">
        <h1 className="text-3xl font-extrabold tracking-tight ">
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
                  ? `${data.input.name} ${
                      data.input.country.toLowerCase() === "global"
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
                <CommandEmpty>No Source found.</CommandEmpty>
                <CommandGroup className="max-h-32 overflow-y-scroll">
                  {Bookies.map((bookie, index) => (
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
                          countryshortcode: string;
                          inputdisabled: boolean;
                          outputdisabled: boolean;
                        };

                        // Create a new object with the desired keys
                        const transformedData = {
                          name: currentValueTransformed.name,
                          country: currentValueTransformed.country,
                          countryShortCode:
                            currentValueTransformed.countryshortcode,
                          inputDisabled: currentValueTransformed.inputdisabled,
                          outputDisabled:
                            currentValueTransformed.outputdisabled,
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
                  ? `${data.output.name} ${
                      data.output.country.toLowerCase() === "global"
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
                <CommandEmpty>No Source found.</CommandEmpty>
                <CommandGroup className="max-h-32 overflow-y-scroll">
                  {Bookies.map((bookie, index) => (
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
                          countryshortcode: string;
                          inputdisabled: boolean;
                          outputdisabled: boolean;
                        };

                        // Create a new object with the desired keys
                        const transformedData = {
                          name: currentValueTransformed.name,
                          country: currentValueTransformed.country,
                          countryShortCode:
                            currentValueTransformed.countryshortcode,
                          inputDisabled: currentValueTransformed.inputdisabled,
                          outputDisabled:
                            currentValueTransformed.outputdisabled,
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
                      toast({
                        description: "Copied to clipboard",
                      });
                    });
                  return;
                }
                void navigator.clipboard
                  .writeText(resData.shareURL)
                  .then(() => {
                    toast({
                      description: "Copied to clipboard",
                    });
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
          href="https://api.whatsapp.com/send/?phone=2348028573902&text=from+your+websit+betconvert.sacsbrainz.com&app_absent=0"
        >
          sascbrainz
        </Link>
      </div>
    </main>
  );
}
