import { database } from "./firebase";

export const convertToMilitaryString = (UTCTimeDate) => {
  let hoursString = String(UTCTimeDate.getHours());
  //make sure that the hours string has 2 characters even it is less than 10
  hoursString = hoursString.length < 2 ? 0 + hoursString : hoursString;
  let minutesString = String(UTCTimeDate.getMinutes());
  //make sure that the minutes string has 2 characters even it is less than 10
  minutesString = minutesString.length < 2 ? 0 + minutesString : minutesString;
  return hoursString + minutesString;
};

//takes in a 4 digitstring in military time and returns it in AM/PM time format
export const convertToAmPm = (militaryString) => {
  let militaryHoursNum = Number(militaryString.slice(0, 2));
  let hoursString =
    militaryHoursNum > 12
      ? String(militaryHoursNum - 12)
      : String(militaryHoursNum);
  if (hoursString === "00") {
    hoursString = "12";
  }
  let minString = militaryString.slice(-2);
  let AmPm = militaryHoursNum > 11 ? "PM" : "AM";
  return `${hoursString}:${minString} ${AmPm}`;
};

// 
export const seedFirebase = () => {
  // Push sleep factors to firebase
  const sleepFactorsRef = database.ref("sleepFactors");
  const sleepFactorsData = [ // This data has already been added, so change factors or they will be duplicated
    {name: "caffeine", category: "chemical"},
    {name: "alcohol", category: "chemical"},
    {name: "CBD", category: "chemical"},
    {name: "melatonin", category: "chemical"},
    {name: "meditated", category: "practice"},
    {name: "worked out", category: "practice"},
    {name: "ate late", category: "practice"},
    {name: "napped", category: "practice"},
    {name: "no screens", category: "practice"},
    {name: "sleep podcast", category: "practice"},
    {name: "stressful day", category: "environment"},
  ]
  sleepFactorsData.forEach(factor => sleepFactorsRef.push(factor));
  console.log("data sent to firebase")

  // Fetch sleep factors from firebase
  let sleepFactors;
  sleepFactorsRef.on("value", (snapshot) => {
    sleepFactors = snapshot.val();
    console.log("sleepFactors", sleepFactors);
  });
  console.log("data fetched from firebase")

  // Set user profile data
  const userId="" // Update for user to seed
  const userRef = database.ref(`users/${userId}`);
  const userProfileData = { // Update data for specific user
    name: "",
    sleepGoalStart: "", 
    sleepGoalEnd:  "",
    userFactors: sleepFactors, 
    logReminderOn: true,
    sleepReminderOn: true
  }
  userRef.set(userProfileData);
  console.log("data sent to firebase")
}