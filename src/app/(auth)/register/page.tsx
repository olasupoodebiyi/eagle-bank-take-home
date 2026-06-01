"use client";

import { useState } from "react";
import { Box, Text, Input, Button, VStack, HStack, Field } from "@chakra-ui/react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { NextLinkBox } from "@/components/ui/NextLink";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { registerSchema, type RegisterFormData } from "@/lib/validations";

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <Field.Root invalid={!!error} w="full">
      <Field.Label htmlFor={id} fontSize="13px" fontWeight="500" color="fg.muted" mb="8px">
        {label}
      </Field.Label>
      {children}
      {error && (
        <Field.ErrorText fontSize="12px" color="coral.400" mt="6px">
          {error}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
}

const inputStyles = (hasError: boolean) => ({
  bg: "surface.2",
  border: "1px solid",
  borderColor: hasError ? "coral.500" : "surface.border",
  color: "fg.default",
  _placeholder: { color: "fg.subtle" },
  _focus: {
    borderColor: hasError ? "coral.500" : "brand.400",
    boxShadow: hasError ? "0 0 0 3px rgba(244,63,94,0.12)" : "0 0 0 3px rgba(90,96,245,0.15)",
    outline: "none",
  },
  _hover: { borderColor: hasError ? "coral.500" : "surface.borderHover" },
  h: "44px",
  borderRadius: "lg",
  fontSize: "14px",
  px: "14px",
});

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = useWatch({ control, name: "password", defaultValue: "" }) ?? "";
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  async function onSubmit(data: RegisterFormData) {
    setServerError("");
    try {
      await authRegister({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      toast({ title: "Account created!", description: "Welcome to Eagle Bank.", status: "success" });
      router.push("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <Box>
      <Box mb="32px">
        <Text fontSize="28px" fontWeight="700" color="fg.default" letterSpacing="-0.5px" mb="8px">
          Create account
        </Text>
        <Text fontSize="14px" color="fg.muted">
          Already have an account?{" "}
          <NextLinkBox href="/login" color="brand.300" fontWeight="500" _hover={{ color: "brand.200" }}>
            Sign in
          </NextLinkBox>
        </Text>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <VStack gap="18px">
          {serverError && (
            <Box w="full" p="12px 16px" bg="rgba(244,63,94,0.08)" border="1px solid" borderColor="rgba(244,63,94,0.2)" borderRadius="lg" role="alert">
              <Text fontSize="13px" color="coral.400">{serverError}</Text>
            </Box>
          )}

          <FormField id="fullName" label="Full name" error={errors.fullName?.message}>
            <Input
              id="fullName"
              type="text"
              placeholder="Alex Morgan"
              autoComplete="name"
              {...register("fullName")}
              {...inputStyles(!!errors.fullName)}
            />
          </FormField>

          <FormField id="email" label="Email address" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              {...inputStyles(!!errors.email)}
            />
          </FormField>

          <FormField id="phone" label="Phone number" error={errors.phone?.message}>
            <Input
              id="phone"
              type="tel"
              placeholder="+44 7700 900000"
              autoComplete="tel"
              {...register("phone")}
              {...inputStyles(!!errors.phone)}
            />
          </FormField>

          <FormField id="password" label="Password" error={errors.password?.message}>
            <Box position="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
                {...inputStyles(!!errors.password)}
                pr="44px"
              />
              <Box
                asChild
                position="absolute"
                right="12px"
                top="50%"
                transform="translateY(-50%)"
                color="fg.subtle"
                _hover={{ color: "fg.default" }}
                bg="transparent"
                border="none"
                cursor="pointer"
                p="4px"
              >
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </Box>
            </Box>
            {/* Password strength hints */}
            {password && (
              <VStack gap="4px" mt="10px" align="stretch">
                {Object.entries({
                  length: "At least 8 characters",
                  uppercase: "One uppercase letter",
                  number: "One number",
                }).map(([key, label]) => (
                  <HStack key={key} gap="6px">
                    <Box
                      w="14px"
                      h="14px"
                      borderRadius="full"
                      bg={passwordChecks[key as keyof typeof passwordChecks] ? "emerald.500" : "surface.3"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="background 0.2s"
                    >
                      {passwordChecks[key as keyof typeof passwordChecks] && (
                        <Check size={8} color="white" />
                      )}
                    </Box>
                    <Text
                      fontSize="11px"
                      color={passwordChecks[key as keyof typeof passwordChecks] ? "emerald.400" : "fg.subtle"}
                      transition="color 0.2s"
                    >
                      {label}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            )}
          </FormField>

          <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("confirmPassword")}
              {...inputStyles(!!errors.confirmPassword)}
            />
          </FormField>

          <Button
            type="submit"
            w="full"
            h="46px"
            bg="brand.600"
            color="white"
            fontWeight="600"
            fontSize="15px"
            borderRadius="lg"
            loading={isSubmitting}
            loadingText="Creating account…"
            _hover={{ bg: "brand.500" }}
            _active={{ bg: "brand.700" }}
            mt="4px"
          >
            Create account
            <ArrowRight size={18} />
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
