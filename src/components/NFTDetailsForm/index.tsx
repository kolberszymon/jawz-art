import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import UploadFileInput from '../UploadFileInput';

const validationSchema = Yup.object().shape({
  price: Yup.number().min(0).required(`Price is required`),
  title: Yup.string()
    .min(1, `Title has to be at least one letter`)
    .required(`Title is required`),
  description: Yup.string(),
  royalties: Yup.number()
    .integer(`Royalties have to be integer number`)
    .default(10)
    .min(0)
    .max(50)
    .required(),
  inputFile: Yup.mixed().required(),
});

type FormValues = {
  price: number;
  title: string;
  description?: string;
  royalties: number;
  inputFile: FileList;
};

type NFTDetailsFormProps = {
  sendData: (data: FormValues) => void;
};

const NFTDetailsForm: React.FC<NFTDetailsFormProps> = ({ sendData }) => {
  const { register, handleSubmit, setValue, setError, formState } =
    useForm<FormValues>({ resolver: yupResolver(validationSchema) });
  const { errors, isValid } = formState;

  useEffect(() => {
    register(`inputFile`);
  }, []);

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) =>
    sendData(data);

  return (
    <form
      className="w-full h-full flex flex-row justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <UploadFileInput setValue={setValue} />
      <div className="w-full md:w-3/5 flex flex-col items-center">
        <div className="w-full h-4/5 flex flex-col items-center mb-12">
          <label htmlFor="price" className="w-3/5 text-left font-bold">
            {`Price ${errors.price ? `(number)` : ``}`}
          </label>
          <div className="border-gray-400 focus-within:border-black flex flex-row items-center w-3/5 border-b-2 mb-4">
            <input
              className=" py-2 outline-none  flex-1 bg-transparent"
              {...register(`price`)}
            />
            <p className="uppercase text-gray-300">ETH</p>
          </div>

          <label
            htmlFor="title"
            className="w-3/5 text-left font-bold"
          >{`Title ${errors.price ? `(required)` : ``}`}</label>
          <input
            className="w-3/5 py-2 outline-none border-b-2 border-gray-400 focus:border-black mb-4"
            {...register(`title`)}
          />
          {/* eslint-disable */}
          <label
            htmlFor="description"
            className="w-3/5 text-left font-bold flex flex-col"
          >
            Description
          </label>
          <input
            className="w-3/5 py-2 outline-none border-b-2 border-gray-400 focus:border-black mb-4"
            {...register(`description`)}
          />
          {/* eslint-enable */}
          <label
            htmlFor="royalties"
            className="w-3/5 text-left font-bold"
          >{`Royalties ${errors.royalties ? `(number)` : ``}`}</label>
          <div className="border-gray-400 focus-within:border-black flex flex-row items-center w-3/5 border-b-2 mb-4">
            <input
              className="flex-1 py-2 outline-none"
              {...register(`royalties`)}
            />
            <p className="uppercase text-gray-300">%</p>
          </div>
        </div>
        <button
          type="submit"
          className="py-2 px-4 text-white bg-red-600 font-bold rounded-full disabled:opacity-50 disabled:cursor-default"
        >
          Create NFT
        </button>
      </div>
    </form>
  );
};

export default NFTDetailsForm;
