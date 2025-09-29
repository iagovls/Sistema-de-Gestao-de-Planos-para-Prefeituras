
import DOMPurify from "dompurify";

export default async function useResetPassword(password: string, confirmPassword: string, token: string) {
    const cleanPassword = DOMPurify.sanitize(password);
    const cleanConfirmPassword = DOMPurify.sanitize(confirmPassword);
    

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            
            },
            body: JSON.stringify({
                password: cleanPassword,
                confirmPassword: cleanConfirmPassword,
                token: token,
            }),
            mode: 'cors',
            credentials: 'include',
        });
        

        if(response.ok){
            return {
                success: true,
                message: 'Senha resetada com sucesso',
            }
        }else{
            return {
                success: false,
                message: 'Erro ao resetar senha',
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Erro ao resetar senha',
        }
    }
}