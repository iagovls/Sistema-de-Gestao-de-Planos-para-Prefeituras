"use client";

import Title from "@/app/components/title";
import { useState, useEffect, Suspense } from "react";
import BotaoIncluir from "@/app/components/botoes/botaoIncluir";
import PopUpConfirmation from "@/app/components/popupConfirmation";
import { Erro, User } from "@/app/types/proposta";

export default function GerenciarUsuarios() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <GerenciarUsuariosContent />
    </Suspense>
  )
}

function GerenciarUsuariosContent() {


  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro,  setErro] = useState<Erro | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleIncluirUsuario = () => {
    // Redirecionar para a página de criação de usuário
    window.location.href = "/conta/gerenciar-usuarios/criar-usuario";
  };

  // handle confirmação de exclusão
  const handleConfirmDelete = (user: User) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setErro({ message: "Token não encontrado" });
      setShowModal(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/delete?id=${userToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Erro ao deletar usuário: " + res.statusText);
      }
      setSuccessMsg("Usuário excluído com sucesso!");
      setUsers(users.filter((user) => user.id !== userToDelete.id));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido ao deletar usuário";
      setErro({ message });
    } finally {
      setShowModal(false);
      setUserToDelete(null);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setErro({ message: "Token não encontrado" });
          return;
        }

        const res = await fetch("http://localhost:8080/auth/get-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Falha ao buscar usuários: " + res.statusText);
        }
        setIsLoading(false);
        setErro(null);
        const data = await res.json();

        if (data.length === 0) {
          setErro({ message: "Nenhum usuário encontrado" });
          return;
        }
        setUsers(data);
      } catch (error: unknown) {
        console.error("Erro ao buscar usuário:", error);
        const message = error instanceof Error ? error.message : "Erro desconhecido ao buscar usuários";
        setErro({ message });
      }
    };

    fetchUser();
  }, []);
  return (
    <main className="flex flex-col items-center ">
      <Title titulo={"Gerenciar usuários"} />
      
      <button onClick={handleIncluirUsuario} className="mb-4">
          <BotaoIncluir titulo="usuário" onClick={handleIncluirUsuario} />
          {erro && <div className="text-red-600">{erro.message}</div>}
      </button>
      

      <div className="md:w-96 gap-2 flex flex-col text-start bg-white rounded-2xl shadow-sm w-10/12 h-auto p-5 mt-5">
        {erro && <div className="text-red-600">{erro.message}</div>}
        {isLoading && <div>Carregando...</div>}

        {users &&
          users.map((user, index) => (
            <div key={index} className="flex justify-between items-center p-2 ">
              <div>
                <p className="font-semibold">{user.completeName}</p>
                <p className="text-sm">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 hover:cursor-pointer"
                  onClick={() => handleConfirmDelete(user)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
      </div>
      {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}

      {/* Modal de confirmação */}
      {showModal && userToDelete && 
      <PopUpConfirmation
          message={`Tem certeza que deseja excluir ${userToDelete.completeName}?`}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowModal(false);
            setUserToDelete(null);
          }}
        />    
      }
    </main>
  );
}
