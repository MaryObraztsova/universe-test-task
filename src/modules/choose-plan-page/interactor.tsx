import { API } from "../../services/api";
import { ApiFile } from "../../services/api/types";
import { generatePDFCover } from "../../use-cases/generate-pdf-cover";
import {
  PaymentPlanId,
} from "../../use-cases/get-subscription-products";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { FileLinkHook, GetPlansHook, ImagePdfHook, PaymentRemoteConfigHook, PaymentSubscriptionProductsHook, PaymentUserHook, Plan } from './interactor.types';
import { InternalFileType } from '../../shared/types';
import { PageLinks } from '../../shared/routes';
import { useSearchParams } from 'next/navigation'
import { SELECTED_PLAN_SEARCH_KEY } from './interactor.config';

type UsePaymentPageInteractorArguments = {
  imagesFormat: InternalFileType[];
	useSubscriptionProductsHook: PaymentSubscriptionProductsHook;
	useUserHook: PaymentUserHook;
	useRemoteConfigHook: PaymentRemoteConfigHook;
  useGetPlansHook: GetPlansHook;
  useImagePdfHook: ImagePdfHook;
  useFileLinkHook: FileLinkHook;
};

export const usePaymentPageInteractor = ({
	useSubscriptionProductsHook,
	useUserHook,
	useRemoteConfigHook,
  useGetPlansHook,
  useImagePdfHook,
  useFileLinkHook,
  imagesFormat
}: UsePaymentPageInteractorArguments) => {
  const router = useRouter();

  const { products } = useSubscriptionProductsHook();
  const  user  = useUserHook();
  const { abTests, isRemoteConfigLoading } = useRemoteConfigHook();
  const getPlans = useGetPlansHook({ products: Object.values(products) });
  
  // use query param as selected plan
  // const [selectedPlan, setSelectedPlan] = React.useState<PaymentPlanId>(
  //   PaymentPlanId.MONTHLY_FULL
  // );

  const [file, setFile] = React.useState<ApiFile>();
  // @NOTE: generating cover for pdf-documents
  const { imagePDF, isImageLoading } = useImagePdfHook(file)
  const {fileLink} = useFileLinkHook({file, imagesFormat});

const selectedPlan = useMemo(() => {
  // TODO: add searchParam parse via zod to remove "as"
  return router.query?.[SELECTED_PLAN_SEARCH_KEY] as PaymentPlanId || PaymentPlanId.MONTHLY_FULL
},[
  router.query
]);

const handleUpdatePlanQueryValue = useCallback(async (plan: PaymentPlanId) => {
  await router.replace({
    query: {
      ...router.query,
      [SELECTED_PLAN_SEARCH_KEY]: plan
    }
  })
},[]);

  const onCommentsFlip = () => {
    console.log("send event analytic0");
  };

  const onSelectPlan = useCallback(async (plan: PaymentPlanId) => {
    if (selectedPlan === plan) {
      onContinue("planTab");
      return;
    }
    const product = products[plan]

    if(!product){
      throw new Error('Unknown product as selected plan')
    }

    await handleUpdatePlanQueryValue(plan)

    console.log(
      "send event analytic1",
      "productId: ",
      plan,
      "currency: ",
      product.price.currency || "USD",
      "value: ",
      (product.price.price || 0) / 100
    );
  },[
    selectedPlan,
    products,
    handleUpdatePlanQueryValue
  ])

  const onContinue = (place?: string) => {
    console.log(
      "send event analytic2",
      "place: ",
      place ? place : "button",
      "planName: ",
      selectedPlan
    );

    localStorage.setItem("selectedPlan", selectedPlan);

    router.push({ pathname: `${PageLinks.PAYMENT}`, query: router.query });
  };

  React.useEffect(() => {
    if (user?.subscription !== null) {
      router.push(`${PageLinks.DASHBOARD}`);
    }

    if (!user?.email) {
      router.back();

      return;
    }

    if (user?.email !== null) {
      return;
    }

    if (router.query?.token) {
      API.auth.byEmailToken(router.query.token as string);
    }
  }, [user?.subscription, user?.email, router.query?.token]);
  
    // @NOTE: analytics on page rendered
  React.useEffect(() => {
    if (!localStorage.getItem("select_plan_view")) {
      console.log("send event analytic3");
    }

    localStorage.setItem("select_plan_view", "true");

    return () => {
      localStorage.removeItem("select_plan_view");
    };
  }, []);


  React.useEffect(() => {
    API.files.getFiles().then((res) => {
      if (router.query?.file) {
        const chosenFile = res.files.find(
          (item) => item.id === router.query!.file
        );

        setFile(chosenFile);

        return;
      }
      setFile(res.files[res.files.length - 1]);
    });
  }, []);

  // @NOTE: setting pre-select plan for users from remarketing emails
  React.useEffect(() => {
    if (router.query?.fromEmail !== "true") {
      return;
    }

    handleUpdatePlanQueryValue(PaymentPlanId.MONTHLY_FULL)
  }, [abTests]);

  return {
    selectedPlan,
    onSelectPlan,
    onContinue,
    onCommentsFlip,

    imagePDF,
    isImageLoading,
    fileName: file?.filename ?? null,
    fileType: file?.internal_type ?? null,
    fileLink,
    isEditorFlow:
      (router.query?.source === "editor" ||
        router.query?.source === "account") &&
      !router.query?.convertedFrom,
    isSecondEmail: router.query?.fromEmail === "true",
    isThirdEmail: router.query?.fromEmail === "true",

    isRemoteConfigLoading,

    getPlans,
    isPlansLoading: Object.values(products).length === 0,
  };
};


export type IPaymentPageInteractor = ReturnType<typeof usePaymentPageInteractor>;