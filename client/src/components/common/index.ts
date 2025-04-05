import { lazy } from "react";

const InputBox = lazy(() => import("./InputBox"));
const TextArea = lazy(() => import("./TextArea"));
const DatetimeSelector = lazy(() => import("./DatetimeSelector"));
const Dropdown = lazy(() => import("./Dropdown"));
const RotatingButton = lazy(() => import("./RotatingButton"));
const SlidingIconButton = lazy(() => import("./SlidingIconButton"));
const ErrorAlert = lazy(() => import("./ErrorAlert"));
const LoadingSpinner = lazy(() => import("./LoadingSpinner"));
const StyledNavLink = lazy(() => import("./StyledNavLink"));

const IconButton = lazy(() => import("./IconButton"));
const AlertWithOptions = lazy(() => import("./AlertWithOptions"));
const SuccessAlert = lazy(() => import("./SuccessAlert"));

export {
  InputBox,
  TextArea,
  DatetimeSelector,
  Dropdown,
  RotatingButton,
  SlidingIconButton,
  ErrorAlert,
  LoadingSpinner,
  StyledNavLink,
  // IconButton,
  // AlertWithOptions,
  // SuccessAlert,
};
