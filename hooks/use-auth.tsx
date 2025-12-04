import { useConvexAuth } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { SignupForm } from "@/components/signup-form";
import { z } from "zod";

const singInSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 character"),
});

const signUpSchema = z.object({
	firstname: z.string().min(2, "First name must be atleast 2 character"),
	lastname: z.string().min(2, "Password must be at least 6 character"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be atleat 6 character"),
});

type SignInData = z.infer<typeof singInSchema>;
type SignUpData = z.infer<typeof signUpSchema>;

export const useAuth = () => {
	const { signIn, signOut } = useAuthActions();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const signInForm = useForm<SignInData>({
		resolver: zodResolver(singInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const signUpForm = useForm<SignUpData>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			firstname: "",
			lastname: "",
			email: "",
			password: "",
		},
	});

	const handleSignIn = async (data: SignInData) => {
		setLoading(true);
		try {
			await signIn("password", {
				email: data.email,
				password: data.password,
				flow: "signIn",
			});
			router.push("/dashboard");
		} catch (error) {
			console.log(error);
			signUpForm.setError("password", {
				message: "invalid email or password",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSignUp = async (data: SignUpData) => {
		setLoading(true);
		try {
			await signIn("password", {
				email: data.email,
				password: data.password,
				name: `${data.firstname} ${data.lastname}`,
				flow: "signUp",
			});
			router.push("/dashboard");
		} catch (error) {
			console.log(error);
			signUpForm.setError("root", {
				message: "Failed to create account, Email may already exist.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSignOut = async () => {
		try{
            await signOut();    
            router.push('/auth/login');
        }
        catch(error){
            console.error('Sign out error', error);
        }
		
		setLoading(false);
	};

	return {
		signInForm,
		SignupForm,
		handleSignIn,
		handleSignUp,
		handleSignOut,
		loading,
	};
};
