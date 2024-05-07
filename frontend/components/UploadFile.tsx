import { Button, Box } from "@chakra-ui/react"
import ImageUploading from 'react-images-uploading'
import { useState } from "react"

const UploadFile = ({ setImage }: any) => {
  const [images, setImages]: any = useState([])
  const [title, setTitle] = useState('')

  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    setImage(imageList[0])
    setImages(imageList)
  }
  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={1}
      dataURLKey="data_url"
    >
      {({
        imageList,
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
        errors,
      }) => (
        <div>
          {images.length <= 0 ? (
            <Box
              w="100%"
              h={'5em'}
              border={'2px'}
              borderRadius={6}
              borderColor={'gray.100'}
              alignContent={'center'}
              textAlign={'center'}
            >
              <button
                style={isDragging ? { color: 'red' } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                Click or Drop here
              </button>
            </Box>
          ) : null}
          {errors && (
            <div>
              {errors.maxNumber && (
                <span>Number of selected images exceed maxNumber</span>
              )}
              {errors.acceptType && (
                <span>Your selected file type is not allow</span>
              )}
              {errors.maxFileSize && (
                <span>Selected file size exceed maxFileSize</span>
              )}
              {errors.resolution && (
                <span>
                  Selected file is not match your desired resolution
                  (must be squared)
                </span>
              )}
            </div>
          )}
          {imageList.map((image, index) => (
            <Box
              key={index}
              alignContent={'center'}
              textAlign={'center'}
            >
              <img
                src={image['data_url']}
                alt=""
                width="100"
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
              <div className="image-item__btn-wrapper">
                <Button
                  variant={'ghost'}
                  onClick={() => onImageUpdate(index)}
                >
                  Update
                </Button>
                <Button
                  variant={'ghost'}
                  onClick={() => onImageRemove(index)}
                >
                  Remove
                </Button>
              </div>
            </Box>
          ))}
        </div>
      )}
    </ImageUploading>
  )
}
export default UploadFile
