import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useRemoteConfig } from "../../providers/remote-config-provider";
import { useUser } from "../../providers/user-provider";
import { API } from "../../services/api";
import { ApiFile } from "../../services/api/types";
import { generatePDFCover } from "../../use-cases/generate-pdf-cover";
import { PaymentPlanId, useGetSubscriptionProducts } from '../../use-cases/get-subscription-products';
import { imagesFormat, InternalFileType, IPaymentPageInteractor, PAGE_LINKS } from './interface';
import productsConvertToPlans from './utils/productsConvertToPlans';

const onCommentsFlip = () => console.log("send event analytic0");

export const usePaymentPageInteractor = (): IPaymentPageInteractor => {
  //State
  const [file, setFile] = useState<ApiFile>();
  const [imagePDF, setImagePDF] = useState<Blob | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [fileLink, setFileLink] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlanId>(PaymentPlanId.MONTHLY_FULL);

  //Hooks
  const router = useRouter();
  const { query: routerQuery } = router
  const { products } = useGetSubscriptionProducts();
  const { user } = useUser();
  const { abTests, isRemoteConfigLoading } = useRemoteConfig();

  const onSelectPlan = (plan: PaymentPlanId): void => {
    if (selectedPlan === plan) {
      onContinue("planTab");
    }

    setSelectedPlan(plan);

    const product = products?.find((item) => item.name === plan);

    console.log(`send event analytic1 productId: ${plan} currency: ${product?.price?.currency || "USD"} value: ${(product?.price?.price || 0) / 100}`);
  };

  const onContinue = (place?: string) => {
    console.log(`send event analytic2 place: ${place || "button"} planName: ${selectedPlan}`);

    localStorage.setItem("selectedPlan", selectedPlan);

    router.push({ pathname: `${PAGE_LINKS.PAYMENT}`, query: routerQuery });
  };

  useEffect(() => {
    if (user?.subscription) {
      router.push(`${PAGE_LINKS.DASHBOARD}`);
    }

    if (!user?.email) {
      router.back();
    }
  }, [user?.subscription, user?.email]);

  useEffect(() => {
    if (routerQuery?.token) {
      API.auth.byEmailToken(routerQuery.token as string);
    }
  }, [routerQuery?.token])

  // // @NOTE: analytics on page rendered
  useEffect(() => {
    if (!localStorage.getItem("select_plan_view")) {
      console.log("send event analytic3");
    }

    localStorage.setItem("select_plan_view", "true");

    return () => {
      localStorage.removeItem("select_plan_view");
    };
  }, []);

  useEffect(() => {//
    API.files.getFiles().then((res) => {

      if (routerQuery?.file) {
        const chosenFile = res.files.find(item => item.id === routerQuery!.file);

        setFile(chosenFile);

        return;
      }

      setFile(res.files[res.files.length - 1]);
    });
  }, []);

  // // @NOTE: setting pre-select plan for users from remarketing emails
  useEffect(() => {
    if (routerQuery?.fromEmail === "true") {
      setSelectedPlan(PaymentPlanId.MONTHLY_FULL_SECOND_EMAIL);
    }
  }, [abTests]);

  const getFileUrl = async () => {
    if (routerQuery?.file) {
      return routerQuery.editedFile === "true"
        ? API.files.editedFile(routerQuery.file as string).then((r) => r.url)
        : API.files.downloadFile(routerQuery.file as string).then((r) => r.url);
    }

    return API.files.downloadFile(file.id).then((r) => r.url);
  }

  // @NOTE: generating cover for pdf-documents
  const loadPdfCover = async (): Promise<void> => {
    setIsImageLoading(true);

    try {
      const fileUrl = await getFileUrl();
      const pdfCover = await generatePDFCover({
        pdfFileUrl: fileUrl,
        width: 640,
      });

      setImagePDF(pdfCover);
    } catch(error) {
      console.log(error)
    } finally {
      setIsImageLoading(false);
    }
  };
  const loadImageCover = async () => {
    try {
      const fileUrl = await getFileUrl();

      setFileLink(fileUrl);
    } catch (error) {
      console.log(error)
    }
  };
  // @NOTE: function for check file.type correctly
  const getFileType = (num: number): boolean => {
    return imagesFormat.includes(file.filename.slice(num).toUpperCase() as InternalFileType)
  }

  useEffect(() => {
    if (file?.internal_type === "PDF") {
      loadPdfCover();
    }

    if (file && imagesFormat.includes(file.internal_type) &&
      // @NOTE: this two checks fir filename exists because sometimes OS do not pass file.type correctly
      (getFileType(-3) || getFileType(-4))
    ) {
      loadImageCover();
    }
  }, [file]);

  return {
    selectedPlan,
    onSelectPlan,
    onContinue,
    onCommentsFlip,
    imagePDF,
    isImageLoading,
    fileName: file?.filename || null,
    fileType: file?.internal_type || null,
    fileLink,
    isEditorFlow: ["editor", "account"].includes(routerQuery?.source as string) && !routerQuery.convertedFrom,
    isSecondEmail: routerQuery?.fromEmail === "true",
    isThirdEmail: routerQuery?.fromEmail === "true",
    isRemoteConfigLoading,
    getPlans: productsConvertToPlans(products),
    isPlansLoading: !products.length,
  };
};
