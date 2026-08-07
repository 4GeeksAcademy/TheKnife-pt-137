

export const useConfirmedDelete = () => {

    async function handleDelete(delete_function, user_id) {
        const confirmation = window.confirm("Are you sure you want to delete this user?")
        if (confirmation) {
            delete_function(user_id)
        }
    }

    return { handleDelete }

}