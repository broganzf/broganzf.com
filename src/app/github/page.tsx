"use client";

import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [flashEmail, setFlashEmail] = useState("");

  //   const reset = async () => {
  //     setLoading(false);
  //     setError("");
  //     setEmails([]);
  //   };

  const submit = async () => {
    if (!username.trim()) {
      setError("enter a username");
      return;
    }

    setLoading(true);
    setError("");
    setEmails([]);

    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
      );

      if (!reposRes.ok) {
        if (reposRes.status === 404) {
          throw new Error("user not found");
        }
        if (reposRes.status === 403) {
          throw new Error("rate limit reached");
        }
        throw new Error("couldn't fetch repositories");
      }

      const repos: any[] = await reposRes.json();

      if (repos.length === 0) {
        setError("no public repositories found");
        setLoading(false);
        return;
      }

      const foundEmails = new Set<string>();

      for (const repo of repos) {
        const fullName = repo.full_name;

        try {
          const commitsRes = await fetch(
            `https://api.github.com/repos/${fullName}/commits?author=${username}&per_page=100`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
              },
            }
          );

          if (!commitsRes.ok) {
            continue;
          }

          const commits: any[] = await commitsRes.json();

          for (const commit of commits) {
            const email = commit.commit?.author?.email;
            if (
              email &&
              email.includes("@") &&
              !email.endsWith("@users.noreply.github.com")
            ) {
              foundEmails.add(email);
            }
          }
        } catch (err) {
          continue;
        }
      }

      if (foundEmails.size === 0) {
        setError("no public email addresses found");
      } else {
        setEmails(Array.from(foundEmails));
      }
    } catch (e: any) {
      setError(e.message || "unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <h1 className="px-5 py-1 rounded-md hover:bg-zinc-800 transition-colors duration-400 ease-in-out text-muted-foreground text-lg">
        github to email
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex flex-col justify-center items-center gap-4"
      >
        <input
          className="border border-zinc-800 hover:border-zinc-700 px-2 py-1 rounded-md hover:bg-zinc-800 transition-colors duration-400 ease-in-out text-muted-foreground text-sm"
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <button
          type="submit"
          disabled={loading || username.trim() === ""}
          className="border border-zinc-800 hover:border-zinc-700 px-15 py-1 rounded-md hover:bg-zinc-800 transition-colors duration-400 ease-in-out text-muted-foreground text-sm"
        >
          {loading ? "loading" : "submit"}
        </button>
      </form>

      {emails.length > 0 && (
        <div className="mt-6 p-4 sm:p-6 border border-zinc-800 rounded-lg bg-zinc-900/50 w-full max-w-md mx-auto">
          <h2 className="flex justify-center mb-5 py-1 rounded-md hover:bg-zinc-800 transition-colors duration-400 ease-in-out text-muted-foreground text-lg">
            emails found
          </h2>

          <ul className="space-y-3 flex justify-center items-center">
            {emails.map((email) => {
              const isFlashing = flashEmail === email;

              return (
                <button
                  key={email}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(email);
                      setFlashEmail(email);
                      setTimeout(() => setFlashEmail(""), 1000);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <li
                    className={`
    text-center py-3 px-4 rounded-lg cursor-pointer select-none
    transition-all duration-300 ease-out bg-zinc-800/40 
    ${
      isFlashing
        ? "border-2 border-green-800 scale-95"
        : "border-2 border-zinc-800 hover:bg-zinc-800/80"
    }
  `}
                  >
                    <span className="text-muted-foreground text-sm sm:text-base font-mono break-all">
                      {email}
                    </span>
                  </li>
                </button> // the button is so big because its the main target for the user to look at and click on
              );
            })}
          </ul>

          {/* <div className="flex justify-center mt-6">
            <button
              onClick={reset}
              className="px-6 py-2 border border-zinc-800 hover:border-zinc-700 rounded-md hover:bg-zinc-800 transition-colors duration-300 ease-in-out text-muted-foreground text-sm"
            >
              reset
            </button>
          </div> */}
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-900/50 rounded-md bg-red-900/20 text-red-400 max-w-md w-full text-center">
          {error}
        </div>
      )}

      <p className="max-w-md text-center text-xs text-muted-foreground leading-relaxed px-5 py-1 rounded-md hover:bg-zinc-800 transition-colors duration-400 ease-in-out text-muted-foreground">
        Only finds emails from public commits in the last ~90 days where the
        user has not enabled{" "}
        <span className="break-all font-medium">
          "Keep my email addresses private"
        </span>{" "}
        in GitHub settings.
      </p>
    </div> // this stuff looks weird because i wanted to make it look cleaner and less wide
  );
}
