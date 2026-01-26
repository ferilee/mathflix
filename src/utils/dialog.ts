import { reactive } from "vue";

type DialogMode = "alert" | "confirm" | "prompt";
type DialogVariant = "info" | "success" | "warning" | "danger";

type DialogPayload = {
  title: string;
  message: string;
  mode?: DialogMode;
  variant?: DialogVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  inputPlaceholder?: string;
  defaultValue?: string;
};

type DialogState = {
  open: boolean;
  mode: DialogMode;
  variant: DialogVariant;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  inputValue: string;
  inputPlaceholder: string;
};

const dialogState = reactive<DialogState>({
  open: false,
  mode: "alert",
  variant: "info",
  title: "",
  message: "",
  confirmLabel: "OK",
  cancelLabel: "Batal",
  inputValue: "",
  inputPlaceholder: "",
});

let resolver: ((value: boolean | string | null) => void) | null = null;

const openDialog = (payload: DialogPayload) => {
  dialogState.mode = payload.mode || "alert";
  dialogState.variant = payload.variant || "info";
  dialogState.title = payload.title;
  dialogState.message = payload.message;
  dialogState.confirmLabel =
    payload.confirmLabel || (dialogState.mode === "alert" ? "OK" : "Ya");
  dialogState.cancelLabel = payload.cancelLabel || "Batal";
  dialogState.inputValue = payload.defaultValue || "";
  dialogState.inputPlaceholder = payload.inputPlaceholder || "";
  dialogState.open = true;
  return new Promise<boolean | string | null>((resolve) => {
    resolver = resolve;
  });
};

const closeDialog = (value: boolean | string | null) => {
  dialogState.open = false;
  if (resolver) {
    resolver(value);
    resolver = null;
  }
};

export const useDialogState = () => dialogState;

export const useDialog = () => {
  const alert = async (
    message: string,
    title = "Pemberitahuan",
    variant: DialogVariant = "info",
  ) => {
    await openDialog({
      title,
      message,
      mode: "alert",
      confirmLabel: "OK",
      variant,
    });
    return true;
  };

  const confirm = async (
    message: string,
    title = "Konfirmasi",
    confirmLabel = "Ya",
    cancelLabel = "Batal",
    variant: DialogVariant = "warning",
  ) => {
    const result = await openDialog({
      title,
      message,
      mode: "confirm",
      confirmLabel,
      cancelLabel,
      variant,
    });
    return Boolean(result);
  };

  const prompt = async (
    message: string,
    title = "Input",
    inputPlaceholder = "",
    confirmLabel = "Simpan",
    cancelLabel = "Batal",
    variant: DialogVariant = "info",
  ) => {
    const result = await openDialog({
      title,
      message,
      mode: "prompt",
      inputPlaceholder,
      confirmLabel,
      cancelLabel,
      variant,
    });
    if (typeof result === "string") return result;
    return null;
  };

  return {
    alert,
    confirm,
    prompt,
  };
};

export const confirmDialog = () => {
  if (dialogState.mode === "prompt") {
    closeDialog(dialogState.inputValue);
    return;
  }
  closeDialog(true);
};

export const cancelDialog = () => {
  if (dialogState.mode === "alert") {
    closeDialog(true);
    return;
  }
  closeDialog(dialogState.mode === "prompt" ? null : false);
};
