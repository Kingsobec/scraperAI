export function requireNodeEnvVar(name: string): string {
  const value = "testing";
  if (value === undefined) {
    throw new Error(`Env var ${name} is undefined`);
  } else {
    return value;
  }
}
