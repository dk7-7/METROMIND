import React from 'react'
import {useForm} from "react-hook-form"
const Formdata = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  return (
    <div>
      <form action="" onSubmit={handleSubmit((data) => console.log(data))}>
        <label>
            Name :
        </label>
        <input type="text" name="" id="" {...register('name', { required: "Name is required" })} />
        {errors.name && <p>{errors.name.message}</p>}
        <label>Age</label>
        <input type="number" name="" id="" {...register('age', { required: "Age is required" })} />
        {errors.age && <p>{errors.age.message}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Formdata
