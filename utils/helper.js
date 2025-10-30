import * as LocalAuthentication from "expo-local-authentication";

export function formatCurrency(amount, currency, decimalDigits) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: decimalDigits ?? 0,
  });
  const monetary = formatter.format(amount);
  return currency === undefined ? monetary : `${monetary} ${currency}`;
}
// Output: "1,234.56 USD"

export const capitalizeAndReplaceHyphens = (text) => {
  // Replace hyphens with spaces
  if (text && typeof text === "string") {
    let result = text?.replace(/-/g, " ");

    // Capitalize the first letter of each word
    result = result
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return result;
  }
};
// Output: "Hello World This Is A Test"

export const formatDate = dateString => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return ''; // you can also throw an error or return "Invalid date"
  }

  const options = {year: 'numeric', month: 'long', day: '2-digit'};
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
// Output: "January 01, 2024"



export const formatDateWithSpace = date => {
  const options = {year: 'numeric', month: 'long', day: '2-digit'};
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

export const formatTime = dateString => {
   const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return ''; // you can also throw an error or return "Invalid date"
  }

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
    return new Intl.DateTimeFormat('en-US', options).format(date);

  // return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};
// Output: "12:00:00 AM"

export const formatShortDateTime = date => {
  const options = {
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return new Date(date).toLocaleString('en-US', options);
};
// Output: "Mon, 12:00 AM"

export const formatDateToMonthYear = dateStr => {
  const date = new Date(dateStr);
  const options = {year: 'numeric', month: 'long'};
  return date.toLocaleDateString('en-US', options);
};
// Output: "January 2024"

export const formatShortDate = dateString => {
  const date = new Date(dateString);

  // Extract date components
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based in JavaScript
  const year = date.getFullYear();

  // Pad day and month with leading zeros if they are less than 10
  const dayStr = day < 10 ? '0' + day : day;
  const monthStr = month < 10 ? '0' + month : month;

  return `${dayStr}/${monthStr}/${year}`;
};
// Output: "01/01/2024"

export const formatShortMonth = date => {
  const options = {month: 'short', day: 'numeric'};
  return new Date(date).toLocaleDateString('en-US', options);
};
// Output: "Jan 1"

export const formatShortMonthYear = date => {
  const options = {year: 'numeric', month: 'short', day: 'numeric'};
  return new Date(date).toLocaleDateString('en-US', options);
};
// Output: "Jan 1, 2024"

export const formatConstantToNormalCase = (constant) => {
  return constant
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


export const capitalize = (str) => {
  if (!str) return '';  // Handle empty strings
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export const convertToIntegerCents = (amount) => {
  // Convert to float first to handle both string and number inputs
  const floatAmount = parseFloat(amount);
  // Multiply by 100 and round to handle any floating point precision issues
  return Math.round(floatAmount * 100);
};

export const convertToFloatCents = (amount) => {
  // Convert to float first to handle both string and number inputs
  const floatAmount = (amount)/100;
  // Multiply by 100 and round to handle any floating point precision issues
  return floatAmount.toFixed(2);
};

export function timeAgo(isoString) {
  const now = new Date();
  const past = new Date(isoString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export const handleSensitiveAction = async (action) => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate to confirm transaction",
  });

  if (result.success) {
    console.log("Transaction Authorized");
    action();
  } else {
    console.log("Authentication Failed");
  }
};