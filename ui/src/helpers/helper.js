export function convertTimestampToDate(timestamp) {
    if (!timestamp?.seconds) return "";

    const date = new Date(
        Number(timestamp.seconds) * 1000 +
        Math.floor(Number(timestamp.nanos) / 1_000_000)
    );
    return date.toLocaleString()
}

// const date = firestoreTimestampToDate(issue_date);

// console.log(date);
// console.log(date.toLocaleString());