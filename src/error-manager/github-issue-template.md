${description}

---

| Debug info     |                                     |
| :------------- | :---------------------------------- |
| Version        | ${version}                          |
| Commit Hash    | ${commitHash}                       |
| Commit Date    | ${commitDate}                       |
| Electron       | ${electronVersion}                  |
| Chrome         | ${chromeVersion}                    |
| Node.js        | ${nodeVersion}                      |
| V8             | ${v8Version}                        |
| OS             | ${osType} ${osArch} ${osRelease}    |

<details>

<summary>Main log</summary>

```vim
${mainLog}
```

</details>

<details>

<summary>Worker errors</summary>

```vim
${workerErrors}
```

</details>

<details>

<summary>Worker exceptions</summary>

```vim
${workerExceptions}
```

</details>

---

*The issue opened from the electron app*