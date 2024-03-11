const process = require('process');

function parseArgs(options = {}) {
  const args = {};
  const flags = {};

  // Loop through process.argv (excluding the first two elements: node path and script path)
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    // Check if it's a flag (--option=value)
    if (arg.startsWith('--')) {
      const [flag, value] = arg.slice(2).split('=');
      flags[flag] = value || true; // Flag without value is considered a boolean flag set to true
    } else {
      // Treat it as a positional argument
      const index = i - 2; // Adjust index to account for skipping first two arguments
      args[index] = arg;
    }
  }

  // Apply options (e.g., defaults, type conversion)
  return Object.assign({}, flags, options.defaults || {}, applyOptions(args, options.types));
}

function applyOptions(args, argumentTypes) {
  if (!argumentTypes) {
    return args;
  }

  const typedArgs = {};
  for (const [key, value] of Object.entries(args)) {
    const type = argumentTypes[key];
    if (type) {
      typedArgs[key] = convertByType(value, type);
    } else {
      typedArgs[key] = value;
    }
  }
  return typedArgs;
}

function convertByType(value, type) {
  switch (type) {
    case 'number':
      return Number(value);
    case 'boolean':
      return value.toLowerCase() === 'true';
    default:
      return value;
  }
}

module.exports = {
  parseArgs,
};
