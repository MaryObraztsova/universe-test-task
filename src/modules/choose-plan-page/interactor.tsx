import { API } from "../../services/api";
import { ApiFile } from "../../services/api/types";
import { generatePDFCover } from "../../use-cases/generate-pdf-cover";
import {
  PaymentPlanId,
} from "../../use-cases/get-subscription-products";
import { useRouter } from "next/router";
import React from "react";
import { GetPlansHook, PaymentRemoteConfigHook, PaymentSubscriptionProductsHook, PaymentUserHook, Plan } from './interactor.types';
import { InternalFileType } from '../../shared/types';
import { PageLinks } from '../../shared/routes';


type UsePaymentPageInteractorArguments = {
  imagesFormat: InternalFileType[];
	useSubscriptionProductsHook: PaymentSubscriptionProductsHook;
	useUserHook: PaymentUserHook;
	useRemoteConfigHook: PaymentRemoteConfigHook;
  useGetPlansHook: GetPlansHook;
};

export const usePaymentPageInteractor = ({
	useSubscriptionProductsHook,
	useUserHook,
	useRemoteConfigHook,
  useGetPlansHook,
  imagesFormat,
}: UsePaymentPageInteractorArguments) => {
  const router = useRouter();

  const { products } = useSubscriptionProductsHook();
  const  user  = useUserHook();
  const { abTests, isRemoteConfigLoading } = useRemoteConfigHook();
  
  // use query param as selected plan
  const [selectedPlan, setSelectedPlan] = React.useState<PaymentPlanId>(
    PaymentPlanId.MONTHLY_FULL
  );
  const [file, setFile] = React.useState<ApiFile>();
  // TODO: incapsulate PDf and FileLink into separate hooks 
  const [imagePDF, setImagePDF] = React.useState<Blob | null>(null);
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const [fileLink, setFileLink] = React.useState<string | null>(null);


  const onCommentsFlip = () => {
    console.log("send event analytic0");
  };

  const onSelectPlan = (plan: PaymentPlanId) => {
    if (selectedPlan === plan) {
      setSelectedPlan(plan);
      onContinue("planTab");

      return;
    }
    setSelectedPlan(plan);
    const product = products?.find((item) => item.name === plan);

    console.log(
      "send event analytic1",
      "productId: ",
      plan,
      "currency: ",
      product?.price?.currency || "USD",
      "value: ",
      (product?.price?.price || 0) / 100
    );
  };

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

  // @NOTE: generating cover for pdf-documents
  const loadPdfCover = async (): Promise<void> => {
    if (!file || file.internal_type !== "PDF") {
      return;
    }

    setIsImageLoading(true);

    try {
      const fileUrl = await (async () => {
        if (router.query?.file) {
          return router.query.editedFile === "true"
            ? API.files
                .editedFile(router.query.file as string)
                .then((r) => r.url)
            : API.files
                .downloadFile(router.query.file as string)
                .then((r) => r.url);
        }

        return API.files.downloadFile(file.id).then((r) => r.url);
      })();

      const pdfCover = await generatePDFCover({
        pdfFileUrl: fileUrl,
        width: 640,
      });
      setImagePDF(pdfCover);
    } finally {
      setIsImageLoading(false);
    }
  };

  const loadImageCover = async () => {
    if (
      !file ||
      !imagesFormat.includes(file.internal_type) ||
      // @NOTE: this two checks fir filename exists because sometimes OS do not pass file.type correctly
      !imagesFormat.includes(
        file.filename.slice(-3).toUpperCase() as InternalFileType
      ) ||
      !imagesFormat.includes(
        file.filename.slice(-4).toUpperCase() as InternalFileType
      )
    ) {
      return;
    }
    const fileUrl = await (async () => {
      if (router.query?.file) {
        return router.query.editedFile === "true"
          ? API.files.editedFile(router.query.file as string).then((r) => r.url)
          : API.files
              .downloadFile(router.query.file as string)
              .then((r) => r.url);
      }

      return API.files.downloadFile(file.id).then((r) => r.url);
    })();

    setFileLink(fileUrl);
  };

  const getPlans = useGetPlansHook({ products });

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
    if (router.query?.fromEmail === "true") {
      setSelectedPlan(PaymentPlanId.MONTHLY_FULL_SECOND_EMAIL);
      return;
    }
  }, [abTests]);

  React.useEffect(() => {
    loadPdfCover();
    loadImageCover();
  }, [loadImageCover, loadPdfCover]);

  return {
    selectedPlan,
    onSelectPlan,
    onContinue,
    onCommentsFlip,

    imagePDF: imagePDF ? imagePDF : null,
    isImageLoading,
    fileName: file ? file.filename : null,
    fileType: file ? file.internal_type : null,
    fileLink,
    isEditorFlow:
      (router.query?.source === "editor" ||
        router.query?.source === "account") &&
      router.query.convertedFrom === undefined,
    isSecondEmail: router.query?.fromEmail === "true",
    isThirdEmail: router.query?.fromEmail === "true",

    isRemoteConfigLoading,

    getPlans,
    isPlansLoading: products.length === 0,
  };
};


export type IPaymentPageInteractor = ReturnType<typeof usePaymentPageInteractor>;