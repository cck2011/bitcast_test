import { useEffect, useState, Fragment } from "react";
import { Alert } from "reactstrap";
import {
    SubmitHandler,
    useForm,
    Controller,
    useFieldArray,
    useWatch,
} from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState, RootThunkDispatch } from "../../store";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateBids.scss";
import { fetchCategories } from "../../redux/products/actions";
import { push } from "connected-react-router";
import { CloseCross, DatePickerIcon } from "./components/Fontawsome";
import { v4 } from "uuid";
import "bootstrap/dist/css/bootstrap.min.css";
import path from "path";
import { HomepageCanvas } from "../homepage/components/HomePageKonva";
import { Canvass } from "../LiveStream/components/Konva2";
// import { AnySet } from "immer/dist/internal";
// import { BsWindowSidebar } from "react-icons/bs";
// import axios from "axios";
// import moment from "moment";

interface liveInput {
    liveTitle: string;
    liveImage: string;
    startDate: Date;
    description?: string | undefined;
}
interface productInput {
    name: string;
    productImage: string;
    minimumBid: string;
    eachBidAmount: string;
    buyPrice: string;
    categoryId: string;
    description?: string | undefined;
}

type Inputs = {
    liveInput: liveInput;
    productInput: productInput[];
};

//fontAwesome component

export function CreateBids() {
    //config
    const dispatch = useDispatch();

    // get current
    const user = useSelector((state: RootState) => state.authState.user);
    // console.log("user", user);
    const userInfo = JSON.parse(JSON.stringify(user));

    //get category
    const categories = useSelector((state: RootState) =>
        Object.values(state.products.categories)
    );
    const { register, watch, handleSubmit, control } = useForm<Inputs>();
    useEffect(() => {
        // fetch ser 拎 categories data
        dispatch(fetchCategories());
    }, [dispatch]);

    // Alert
    const [alert, setAlert] = useState<any>([]);

    const removeAlert = (e: any) => {
        setAlert([]);
    };
    function AlertRequireProductsListAppend() {
        return (
            <div>
                <Alert className={"Alert_container"} color="info">
                    請先登記最少一樣商品
                    <div className={"close-alert"} onClick={removeAlert}>
                        <CloseCross />
                    </div>
                </Alert>
            </div>
        );
    }

    function AlertRequireProductsImageAppend() {
        return (
            <div>
                <Alert className={"Alert_container"} color="info">
                    請重新確認商品照片
                    <div className={"close-alert"} onClick={removeAlert}>
                        <CloseCross />
                    </div>
                </Alert>
            </div>
        );
    }

    // onsubmit
    let [productImgConfirm, setProductImgConfirm] = useState(false);
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const checkProductsList = data.productInput;
        let confirm: boolean = false;
        // console.log("pro", checkProductsList);

        if (checkProductsList.length > 0) {
            for (let product of checkProductsList) {
                if (
                    product.productImage[0]
                    // product.productImage != null ||
                    // product.productImage != undefined
                ) {
                    // setProductImgConfirm(true);
                    confirm = true;
                } else {
                    // setProductImgConfirm(false);
                    //Alert
                }
            }
            if (confirm) {
                const live = data.liveInput;

                // ** live Inputs FormData Field **
                // ** live Inputs FormData Field **
                // FormData Append
                let liveFormData = new FormData();

                liveFormData.append("liveTitle", data.liveInput.liveTitle);

                if (selectedImage != undefined) {
                    liveFormData.append("liveImage", selectedImage);
                } else {
                }

                if (data.liveInput.description) {
                    liveFormData.append(
                        "description",
                        data.liveInput.description
                    );
                }
                if (data.liveInput.startDate) {
                    liveFormData.append(
                        "startDate",
                        data.liveInput.startDate.toString()
                    );
                }
                if (userInfo != null) {
                    liveFormData.append("userId", userInfo.id);
                }

                //fetch live Input liveFormData
                let liveId: any = null;

                if (selectedImage != undefined) {
                    const liveRes = await fetch(
                        `${process.env.REACT_APP_BACKEND_URL}/createBids/submitBid/submitLive`,
                        {
                            method: "POST",
                            body: liveFormData,
                        }
                    );
                    const liveJson = await liveRes.json();
                    // console.log("liveJson.data.res", liveJson.data.res[0]);
                    liveId = liveJson.data.res[0].id;
                } else {
                    liveId = null;
                }

                // ** live Inputs FormData Field **
                // ** live Inputs FormData Field **

                //! **************************************************

                // ** Products Inputs FormData Field **
                // ** Products Inputs FormData Field **
                const products = data.productInput;
                if (liveId != null) {
                    for (let [index, product] of products.entries() as any) {
                        let productFormData = new FormData();
                        productFormData.append("name", product.name);
                        productFormData.append(
                            "productImage",
                            product.productImage[0]
                        );
                        productFormData.append(
                            "minimumBid",
                            product.minimumBid
                        );
                        productFormData.append(
                            "eachBidAmount",
                            product.eachBidAmount
                        );
                        productFormData.append("buyPrice", product.buyPrice);
                        productFormData.append(
                            "categoryId",
                            product.categoryId
                        );
                        if (product.description) {
                            productFormData.append(
                                "description",
                                product.description
                            );
                        }
                        productFormData.append("liveId", liveId);
                        productFormData.append("productIndex", index);
                        if (userInfo != null) {
                            productFormData.append(
                                "username",
                                userInfo.username
                            );
                            productFormData.append("userId", userInfo.id);
                        }

                        const proRes = await fetch(
                            `${process.env.REACT_APP_BACKEND_URL}/createBids/submitBid/submitProduct`,
                            {
                                method: "POST",
                                body: productFormData,
                            }
                        );
                        const proJson = await proRes.json();
                    }

                    // dispatch to reducer
                    dispatch(push("/"));
                } else {
                }
            } else {
                if (alert.length === 0) {
                    setAlert(alert.concat(<AlertRequireProductsImageAppend />));
                } else {
                    // setAlert([]);
                    setAlert([<AlertRequireProductsImageAppend />]);
                }
            }
        } else {
            if (alert.length === 0) {
                setAlert(alert.concat(<AlertRequireProductsListAppend />));
            } else {
                setAlert([<AlertRequireProductsListAppend />]);
            }
        }

        // ajax/fetch here
    };
    // ** Products Inputs FormData Field **
    // ** Products Inputs FormData Field **

    const { fields, append, remove } = useFieldArray({
        control,
        name: "productInput",
    });

    // live streaming photo shown setup
    const [selectedImage, setSelectedImage] = useState<any>();

    const imageChange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            if (
                path.extname(e.target.files[0].name) == ".jpg" ||
                path.extname(e.target.files[0].name) == ".jpeg" ||
                path.extname(e.target.files[0].name) == ".png"
            ) {
                setSelectedImage(e.target.files[0]);
            }
        }
    };

    // DatePicker filter
    const filterPassedTime = (time: any) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        return currentDate.getTime() < selectedDate.getTime();
    };
    // DatePicker className switch
    let handleColor = (time: any) => {
        return time.getHours() > 12 ? "" : "text-error";
    };

    // products index
    const [proNum, setProNum] = useState<number>(1);
    const accProNum = () => {
        // console.log("test");
        append({});
        setProNum(proNum + 1);
    };
    // let productsArr: Array<Blob> = [];

    let watchProducts: any = watch(`productInput`);

    useEffect(() => {
        // console.log("test");
        if (watchProducts != undefined && watchProducts.length) {
            // console.log(
            //     "i want to check this!!!!",
            //     watchProducts[0].productImage
            // );
            for (let watchProduct of watchProducts) {
                if (
                    watchProduct.productImage != null &&
                    watchProduct.productImage != undefined &&
                    watchProduct.productImage.length
                ) {
                    // console.log(
                    //     "i want to check this!!!!",
                    //     watchProduct.productImage[0]
                    // );
                    if (
                        path.extname(watchProduct.productImage[0].name) ===
                            ".jpg" ||
                        path.extname(watchProduct.productImage[0].name) ===
                            ".jpeg" ||
                        path.extname(watchProduct.productImage[0].name) ===
                            ".png"
                    ) {
                    } else {
                        // console.log(
                        //     "watchProduct.productImage[0].name",
                        //     watchProduct.productImage[0].name
                        // );
                        // console.log("Image to null");

                        watchProduct.productImage = [];

                        // console.log(
                        //     "watchProduct.productImage",
                        //     watchProduct.productImage
                        // );
                    }
                }
            }
        }
    }, [[watchProducts?.length]]);

    return (
        <div className={"create_bids_container form_shown"}>
            {/* <HomepageCanvas /> */}
            <div className={"outline"}>
                <div className={"header_border"}></div>
                {/* <header className={"test_user"}>For Dev ref Username:{userInfo.username}</header> */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1>拍賣登記</h1>
                    <div className={"input_box"}>
                        <label>直播標題:</label>{" "}
                        <input
                            className={"input_default"}
                            {...register("liveInput.liveTitle")}
                            required
                        />
                    </div>

                    <div className={"input_box"}>
                        <label>直播圖片: </label>{" "}
                        <div className={"files"}>
                            <input
                                type="file"
                                accept="image/*"
                                {...register("liveInput.liveImage")}
                                onChange={imageChange}
                                required
                            />
                        </div>
                        <div className={"upload_reminder"}>
                            (只接收不高於1MB的JPG/PNG/JPEG 照片)
                        </div>
                    </div>

                    {selectedImage && (
                        <div className={"img_container"}>
                            <img
                                className={"resize_upload_photo photo_shown"}
                                src={URL.createObjectURL(selectedImage as any)}
                                alt=""
                            />
                            <div className={"file_Info_container"}>
                                {/* <div>{selectedImage.name as any}</div> */}
                                <div>{selectedImage.type as any}</div>
                                <div>{`${
                                    ((selectedImage.size as any) / 1000000)
                                        .toString()
                                        .match(/^\d+(?:\.\d{0,2})?/) + " MB"
                                }`}</div>
                            </div>
                        </div>
                    )}
                    <div className={"input_box"}>
                        <label>開始時間:</label>
                        <Controller
                            control={control}
                            name="liveInput.startDate"
                            render={({ field }) => (
                                <div>
                                    <DatePicker
                                        className={"Datepicker"}
                                        onChange={(e) => field.onChange(e)}
                                        selected={field.value}
                                        showTimeSelect
                                        // timeClassName={handleColor}
                                        placeholderText="選擇時間"
                                        dateFormat="MM/dd/yyyy hh:mm a"
                                        filterTime={filterPassedTime}
                                        required
                                        // customInput={<DatePickerIcon />}
                                    />
                                    {/* <DatePickerIcon /> */}
                                </div>
                            )}
                        />

                        {/* <DatePickerIcon /> */}
                    </div>
                    <div className={"input_box"}>
                        <label>直播簡介:</label>{" "}
                        <textarea
                            className={"input_textarea"}
                            {...register("liveInput.description")}
                        />
                    </div>

                    {/* <h1>拍賣物品</h1> */}
                    {/*  Append Dynamic Form */}
                    <button
                        className={"button_default"}
                        type="button"
                        onClick={accProNum}
                    >
                        + 增加拍賣品
                    </button>

                    {/*  Dynamic Form */}
                    {fields.map(({ id, name }, index) => {
                        // const watchAllFields = watch();

                        let productsPicture: any = watch(
                            `productInput.${index}.productImage`
                        );

                        return (
                            <div
                                className="item_input_container form_shown"
                                key={id}
                            >
                                <div className={"products_index"}>
                                    商品 {index + 1}
                                </div>

                                <p className={"input_box"}>
                                    <label>物品名稱:</label>
                                    <input
                                        className={"input_default"}
                                        {...register(
                                            `productInput.${index}.name`
                                        )}
                                        defaultValue={name}
                                        required
                                    />
                                </p>

                                <div className={"input_box"}>
                                    <label>物品圖片: </label>
                                    <div className={"files"}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            {...register(
                                                `productInput.${index}.productImage`
                                            )}
                                            required
                                        />
                                    </div>
                                    <div className={"upload_reminder"}>
                                        (只接收不高於1MB的JPG/PNG/JPEG 照片)
                                    </div>
                                </div>

                                {productsPicture?.[0] != null &&
                                    (path.extname(productsPicture[0].name) ===
                                        ".jpg" ||
                                        path.extname(
                                            productsPicture[0].name
                                        ) === ".png" ||
                                        path.extname(
                                            productsPicture[0].name
                                        ) === ".jpeg") && (
                                        <div className={"img_container"}>
                                            {/* {console.log(productsPicture[0])} */}
                                            <img
                                                className={
                                                    "resize_upload_photo photo_shown"
                                                }
                                                src={URL.createObjectURL(
                                                    productsPicture[0] as any
                                                )}
                                                alt=""
                                            />
                                            <div
                                                className={
                                                    "file_Info_container"
                                                }
                                            >
                                                {/* <div>
                                                {productsPicture[0].name as any}
                                            </div> */}
                                                <div>
                                                    {
                                                        productsPicture[0]
                                                            .type as any
                                                    }
                                                </div>
                                                <div>{`${
                                                    (
                                                        (productsPicture[0]
                                                            .size as any) /
                                                        1000000
                                                    )
                                                        .toString()
                                                        .match(
                                                            /^\d+(?:\.\d{0,2})?/
                                                        ) + " MB"
                                                }`}</div>
                                            </div>
                                        </div>
                                    )}

                                <p className={"input_box"}>
                                    <label>底價 HKD:</label>
                                    <input
                                        className={"input_default"}
                                        type="number"
                                        min="0"
                                        {...register(
                                            `productInput.${index}.minimumBid`
                                        )}
                                        required
                                    />
                                </p>

                                <p className={"input_box"}>
                                    <label>每口價 HKD:</label>
                                    <input
                                        className={"input_default"}
                                        type="number"
                                        min="0"
                                        {...register(
                                            `productInput.${index}.eachBidAmount`
                                        )}
                                        required
                                    />
                                </p>

                                <p className={"input_box"}>
                                    <label>即買價 HKD:</label>
                                    <input
                                        className={"input_default"}
                                        type="number"
                                        min="0"
                                        {...register(
                                            `productInput.${index}.buyPrice`
                                        )}
                                        required
                                    />
                                </p>

                                <p className={"input_box"}>
                                    <label>分類:</label>{" "}
                                    <select
                                        className={"category_container"}
                                        {...register(
                                            `productInput.${index}.categoryId`
                                        )}
                                    >
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.category}
                                            </option>
                                        ))}
                                    </select>
                                </p>
                                <p className={"input_box"}>
                                    <label>拍賣品簡介:</label>
                                    <textarea
                                        className={"input_textarea"}
                                        {...register(
                                            `productInput.${index}.description`
                                        )}
                                    />
                                </p>
                                <button
                                    className={"button_default"}
                                    onClick={() => remove(index)}
                                >
                                    刪除商品
                                </button>
                            </div>
                        );
                    })}
                    {alert.map((e: any) => (
                        <div key={v4()}>{e}</div>
                    ))}
                    <input className={"button_default"} type="submit" />
                </form>
            </div>
        </div>
    );
}
