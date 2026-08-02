export const useCloudinary = () => {

    async function uploadImage(e, upload_preset, setter, state) {
        try {
            const image = e.target.files[0];
            const formData = new FormData();
            formData.append("file", image)
            formData.append("upload_preset", upload_preset)
            const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData
            })
            if (!response.ok) throw new Error("Some error has ocurred")
            const data = await response.json()
            setter({
                ...state, img_url: data.secure_url
            })

        } catch (error) {console.log(error)}
    }

    return { uploadImage }

}