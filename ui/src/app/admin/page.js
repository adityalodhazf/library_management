import { fetchMembers } from "../api-services/adminApi";

export default async function AdminPage() {
    let payload = {}
    let response = "emtpy response"

    // // fetch all members
    // payload = {}

    // // fetch all members of a branch
    // payload = {
    //     branch_id: 1
    // }

    // fetch details of a member
    payload = {
        mobile_number: 9673408662
    }

    response = await fetchMembers(payload)
    console.log(response)
    return (
        <p>Admin Page: </p>
    );
}
