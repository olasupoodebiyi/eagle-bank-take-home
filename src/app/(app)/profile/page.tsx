"use client";

import { useState, useRef } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Avatar,
  Textarea,
  Grid,
  Field,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { authFetch } from "@/hooks/useFetch";
import { profileSchema, type ProfileFormData } from "@/lib/validations";
import { PageHeader } from "@/components/layout/PageHeader";
import { formatDate } from "@/lib/utils";
import type { User as UserType } from "@/types";

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
    <Field.Root invalid={!!error}>
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
  borderRadius: "lg",
  fontSize: "14px",
  px: "14px",
});

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      address: user?.address ?? "",
    },
  });

  async function onSubmit(data: ProfileFormData) {
    try {
      const updated = await authFetch<UserType>("/api/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      updateUser(updated);
      toast({ title: "Profile updated", status: "success" });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Please try again",
        status: "error",
      });
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    toast({ title: "Avatar updated (preview only)", status: "info" });
  }

  return (
    <Box>
      <PageHeader
        title="Profile"
        subtitle="Manage your personal information and account settings."
      />

      <Grid templateColumns={{ base: "1fr", lg: "280px 1fr" }} gap="24px">
        {/* Avatar & summary */}
        <VStack gap="16px">
          <Box
            bg="surface.1"
            border="1px solid"
            borderColor="surface.border"
            borderRadius="xl"
            p="32px 24px"
            w="full"
            textAlign="center"
          >
            <Box position="relative" display="inline-block" mb="16px">
              <Avatar.Root size="2xl" w="88px" h="88px">
                <Avatar.Image
                  src={avatarPreview ?? user?.avatar}
                  alt={user?.fullName}
                />
                <Avatar.Fallback bg="brand.800" color="brand.200" fontSize="28px" fontWeight="700">
                  {user?.fullName?.slice(0, 2).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>

              <Box
                as="button"
                position="absolute"
                bottom="-4px"
                right="-4px"
                w="28px"
                h="28px"
                bg="brand.600"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="2px solid"
                borderColor="surface.0"
                cursor="pointer"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile photo"
                transition="background 0.15s"
                _hover={{ bg: "brand.500" }}
              >
                <Camera size={13} color="white" />
              </Box>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
                aria-label="Upload profile photo"
              />
            </Box>

            <Text fontWeight="700" fontSize="16px" color="fg.default" mb="4px">
              {user?.fullName}
            </Text>
            <Text fontSize="13px" color="fg.subtle" mb="16px">
              {user?.email}
            </Text>

            <Box
              bg="surface.3"
              borderRadius="lg"
              p="10px 14px"
              textAlign="left"
            >
              <Text fontSize="11px" color="fg.subtle" mb="2px">Member since</Text>
              <Text fontSize="13px" fontWeight="600" color="fg.default">
                {user?.createdAt ? formatDate(user.createdAt, "MMMM yyyy") : "—"}
              </Text>
            </Box>
          </Box>

          {/* Quick info */}
          <Box
            bg="surface.1"
            border="1px solid"
            borderColor="surface.border"
            borderRadius="xl"
            p="20px 24px"
            w="full"
          >
            <Text fontSize="13px" fontWeight="600" color="fg.muted" mb="14px" letterSpacing="0.5px">
              Account info
            </Text>
            <VStack gap="10px" align="stretch">
              <HStack justify="space-between">
                <Text fontSize="12px" color="fg.subtle">User ID</Text>
                <Text fontSize="12px" fontFamily="mono" color="fg.muted">{user?.id}</Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>

        {/* Edit form */}
        <Box
          bg="surface.1"
          border="1px solid"
          borderColor="surface.border"
          borderRadius="xl"
          p="32px"
        >
          <Text fontWeight="600" fontSize="17px" color="fg.default" mb="28px">
            Personal information
          </Text>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="20px" mb="20px">
              <FormField id="fullName" label="Full name" error={errors.fullName?.message}>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  h="44px"
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
                  h="44px"
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
                  h="44px"
                  {...register("phone")}
                  {...inputStyles(!!errors.phone)}
                />
              </FormField>
            </Grid>

            <FormField id="address" label="Address" error={errors.address?.message}>
              <Textarea
                id="address"
                placeholder="Your full address"
                autoComplete="street-address"
                rows={3}
                {...register("address")}
                bg="surface.2"
                border="1px solid"
                borderColor={errors.address ? "coral.500" : "surface.border"}
                color="fg.default"
                _placeholder={{ color: "fg.subtle" }}
                _focus={{
                  borderColor: errors.address ? "coral.500" : "brand.400",
                  boxShadow: errors.address ? "0 0 0 3px rgba(244,63,94,0.12)" : "0 0 0 3px rgba(90,96,245,0.15)",
                  outline: "none",
                }}
                _hover={{ borderColor: errors.address ? "coral.500" : "surface.borderHover" }}
                borderRadius="lg"
                fontSize="14px"
                px="14px"
                py="12px"
                resize="vertical"
              />
            </FormField>

            <HStack justify="flex-end" mt="28px">
              <Button
                type="submit"
                bg="brand.600"
                color="white"
                fontWeight="600"
                fontSize="14px"
                borderRadius="lg"
                h="42px"
                px="24px"
                loading={isSubmitting}
                loadingText="Saving…"
                disabled={!isDirty && !isSubmitting}
                _hover={{ bg: "brand.500" }}
                _active={{ bg: "brand.700" }}
              >
                <Save size={16} />
                Save changes
              </Button>
            </HStack>
          </form>
        </Box>
      </Grid>
    </Box>
  );
}
