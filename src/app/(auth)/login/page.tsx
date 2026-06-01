"use client";

import { useState } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Field,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { NextLinkBox } from "@/components/ui/NextLink";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { loginSchema, type LoginFormData } from "@/lib/validations";

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError("");
    try {
      await login(data);
      toast({ title: "Welcome back!", status: "success" });
      const redirect = searchParams.get("redirect") ?? "/dashboard";
      router.push(redirect);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <Box>
      <Box mb="36px">
        <Text
          fontSize="28px"
          fontWeight="700"
          color="fg.default"
          letterSpacing="-0.5px"
          mb="8px"
        >
          Sign in
        </Text>
        <Text fontSize="14px" color="fg.muted">
          Don&apos;t have an account?{" "}
          <NextLinkBox href="/register" color="brand.300" fontWeight="500" _hover={{ color: "brand.200" }}>
            Create one
          </NextLinkBox>
        </Text>
      </Box>

      {/* Demo credentials hint */}
      <Box
        bg="rgba(90,96,245,0.08)"
        border="1px solid"
        borderColor="rgba(90,96,245,0.2)"
        borderRadius="lg"
        p="14px 16px"
        mb="28px"
      >
        <Text fontSize="12px" color="brand.300" fontWeight="600" mb="4px">
          Demo credentials
        </Text>
        <Text fontSize="12px" color="fg.muted">
          Email: <Box as="span" fontFamily="mono" color="fg.default">alex.morgan@example.com</Box>
        </Text>
        <Text fontSize="12px" color="fg.muted">
          Password: <Box as="span" fontFamily="mono" color="fg.default">password123</Box>
        </Text>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <VStack gap="20px">
          {serverError && (
            <Box
              w="full"
              p="12px 16px"
              bg="rgba(244,63,94,0.08)"
              border="1px solid"
              borderColor="rgba(244,63,94,0.2)"
              borderRadius="lg"
              role="alert"
            >
              <Text fontSize="13px" color="coral.400">
                {serverError}
              </Text>
            </Box>
          )}

          {/* Email */}
          <Field.Root invalid={!!errors.email} w="full">
            <Field.Label
              htmlFor="email"
              fontSize="13px"
              fontWeight="500"
              color="fg.muted"
              mb="8px"
            >
              Email address
            </Field.Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              bg="surface.2"
              border="1px solid"
              borderColor={errors.email ? "coral.500" : "surface.border"}
              color="fg.default"
              _placeholder={{ color: "fg.subtle" }}
              _focus={{
                borderColor: errors.email ? "coral.500" : "brand.400",
                boxShadow: errors.email
                  ? "0 0 0 3px rgba(244,63,94,0.12)"
                  : "0 0 0 3px rgba(90,96,245,0.15)",
                outline: "none",
              }}
              _hover={{ borderColor: errors.email ? "coral.500" : "surface.borderHover" }}
              h="44px"
              borderRadius="lg"
              fontSize="14px"
              px="14px"
            />
            {errors.email && (
              <Field.ErrorText fontSize="12px" color="coral.400" mt="6px">
                {errors.email.message}
              </Field.ErrorText>
            )}
          </Field.Root>

          {/* Password */}
          <Field.Root invalid={!!errors.password} w="full">
            <HStack justify="space-between" mb="8px" w="full">
              <Field.Label htmlFor="password" fontSize="13px" fontWeight="500" color="fg.muted" m="0">
                Password
              </Field.Label>
              <Box asChild fontSize="12px" color="brand.300" _hover={{ color: "brand.200" }}>
                <a href="#">Forgot password?</a>
              </Box>
            </HStack>
            <Box position="relative" w="full">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                bg="surface.2"
                border="1px solid"
                borderColor={errors.password ? "coral.500" : "surface.border"}
                color="fg.default"
                _placeholder={{ color: "fg.subtle" }}
                _focus={{
                  borderColor: errors.password ? "coral.500" : "brand.400",
                  boxShadow: errors.password
                    ? "0 0 0 3px rgba(244,63,94,0.12)"
                    : "0 0 0 3px rgba(90,96,245,0.15)",
                  outline: "none",
                }}
                _hover={{ borderColor: errors.password ? "coral.500" : "surface.borderHover" }}
                h="44px"
                borderRadius="lg"
                fontSize="14px"
                px="14px"
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
            {errors.password && (
              <Field.ErrorText fontSize="12px" color="coral.400" mt="6px">
                {errors.password.message}
              </Field.ErrorText>
            )}
          </Field.Root>

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
            loadingText="Signing in…"
            _hover={{ bg: "brand.500" }}
            _active={{ bg: "brand.700" }}
            _disabled={{ opacity: 0.5 }}
          >
            Sign in
            <ArrowRight size={18} />
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
