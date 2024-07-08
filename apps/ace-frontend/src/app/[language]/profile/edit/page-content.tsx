"use client";
import { useAuthPatchMeService } from "@/services/api/services/auth";
import { FormProvider, useForm, useFormState } from "react-hook-form";

import { useFileUploadService } from "@/services/api/services/files";
import { FileEntity } from "@/services/api/types/file-entity";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import useLeavePage from "@/services/leave-page/use-leave-page";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import * as yup from "yup";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "@/components/ui/link";
import { toast } from "sonner";

type EditProfileBasicInfoFormData = {
  firstName: string;
  lastName: string;
  photo?: FileEntity;
};

const useValidationBasicInfoSchema = () => {
  const { t } = useTranslation("profile");

  return yup.object().shape({
    firstName: yup
      .string()
      .required(t("profile:inputs.firstName.validation.required")),
    lastName: yup
      .string()
      .required(t("profile:inputs.lastName.validation.required")),
  });
};

function BasicInfoFormActions() {
  const { t } = useTranslation("profile");
  const { isSubmitting, isDirty } = useFormState();
  useLeavePage(isDirty);

  return (
    <Button type="submit" disabled={isSubmitting} data-testid="save-profile">
      {t("profile:actions.submit")}
    </Button>
  );
}

function FormBasicInfo() {
  const fetchAuthPatchMe = useAuthPatchMeService();
  const { t } = useTranslation("profile");
  const validationSchema = useValidationBasicInfoSchema();
  const [file, setFile] = useState<FileEntity | undefined>(undefined);

  const methods = useForm<EditProfileBasicInfoFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      photo: undefined,
    },
  });

  const { handleSubmit, setError, formState } = methods;

  useLeavePage(formState.isDirty);

  const fetchFileUpload = useFileUploadService();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] as FileEntity | undefined;
    if (file) {
      setFile(file);
    }
  };

  const onSubmit = async (formData: EditProfileBasicInfoFormData) => {
    const uploadedFile = await fetchFileUpload(file as any);

    // @ts-ignore
    formData.photo = uploadedFile?.data?.file;

    const { data, status } = await fetchAuthPatchMe(formData);

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (
        Object.keys(data.errors) as Array<keyof EditProfileBasicInfoFormData>
      ).forEach((key) => {
        setError(key, {
          type: "manual",
          message: t(
            `profile:inputs.${key}.validation.server.${data.errors[key]}`
          ),
        });
      });

      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
      // setUser(data);

      toast.success(t("profile:alerts.profile.success"));
    }
  };

  // useEffect(() => {
  //   reset({
  //     firstName: user?.firstName ?? "",
  //     lastName: user?.lastName ?? "",
  //     photo: user?.photo,
  //   });
  // }, [user, reset]);

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-4 w-full "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex  justify-center  ">
          <div className="flex md:flex-col justify-center items-center gap-4">
            <Avatar className="h-16 w-16 md:h-32 md:w-32">
              {/* <AvatarImage
                src={user?.photo?.path}
                alt={user?.firstName + " " + user?.lastName}
              /> */}
              <AvatarFallback>
                {/* <span>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </span> */}
              </AvatarFallback>
            </Avatar>
            <div className="w-[228px]">
              <FileInput
                type="file"
                {...methods.register("photo")}
                name="photo"
                id="photo"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <Label htmlFor="firstName">
              {t("profile:inputs.firstName.label")}
            </Label>
            <Input
              {...methods.register("firstName")}
              data-testid="first-name"
              // errorMessage={methods.formState.errors.firstName?.message}
              placeholder={t("profile:inputs.firstName.placeholder")}
            />
          </div>

          <div>
            <Label htmlFor="lastName">
              {t("profile:inputs.lastName.label")}
            </Label>
            <Input
              {...methods.register("lastName")}
              data-testid="last-name"
              // errorMessage={methods.formState.errors.lastName?.message}
              placeholder={t("profile:inputs.lastName.placeholder")}
            />
          </div>

          <BasicInfoFormActions />
          <Button asChild>
            <Link
              href="/profile"
              className={buttonVariants({ variant: "light" })}
            >
              {t("profile:actions.cancel")}
            </Link>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

function EditProfile() {
  return (
    <>
      <div className="w-3/4 mx-auto flex flex-col mt-4 md:flex-row gap-12 items-center justify-center">
        <FormBasicInfo />
      </div>
    </>
  );
}

export default EditProfile;
