import React, { useState, useEffect } from 'react';

// URL base da sua API backend
const API_URL = "http://localhost:5001";

// Componente de ícone para o ícone de carregamento (Spinner)
const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// Componente principal para gerenciar os produtos
export default function Products() {
    // --- ESTADOS DO COMPONENTE ---
    const [products, setProducts] = useState([]); // Armazena a lista de produtos
    const [isLoading, setIsLoading] = useState(false); // Controla o estado de carregamento
    const [error, setError] = useState(null); // Armazena mensagens de erro

    // Estados para o formulário de adição
    const [newProductName, setNewProductName] = useState('');
    const [newProductDesc, setNewProductDesc] = useState('');

    // Estados para o modal de edição
    const [editingProduct, setEditingProduct] = useState(null); // Armazena o produto sendo editado
    const [editedName, setEditedName] = useState('');
    const [editedDesc, setEditedDesc] = useState('');

    // --- EFEITOS (LIFECYCLE) ---

    // useEffect para buscar os produtos da API quando o componente é montado
    useEffect(() => {
        fetchProducts();
    }, []);

    // --- FUNÇÕES DE INTERAÇÃO COM A API ---

    // Função para buscar todos os produtos
    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/produto`);
            if (!response.ok) {
                throw new Error('Falha ao buscar produtos. O servidor respondeu com status ' + response.status);
            }
            const data = await response.json();
            // Adiciona a propriedade 'quantity' a cada produto (controlado apenas no frontend)
            const productsWithQuantity = data.map(p => ({ ...p, quantity: 1 }));
            setProducts(productsWithQuantity);
        } catch (err) {
            setError(err.message || "Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
            console.error("Erro ao buscar produtos:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para adicionar um novo produto
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProductName || !newProductDesc) {
            alert("Por favor, preencha o nome e a descrição do produto.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/produto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: newProductName, descricao: newProductDesc }),
            });

            if (!response.ok) {
                throw new Error("Falha ao adicionar o produto.");
            }

            // Limpa os campos e atualiza a lista de produtos
            setNewProductName('');
            setNewProductDesc('');
            fetchProducts();
        } catch (err) {
            setError(err.message);
            console.error("Erro ao adicionar produto:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para deletar um produto
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Tem certeza de que deseja excluir este produto?")) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/produto/${productId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error("Falha ao deletar o produto.");
            }
            // Atualiza a lista de produtos no estado, removendo o item deletado
            setProducts(products.filter(p => p.id !== productId));
        } catch (err) {
            setError(err.message);
            console.error("Erro ao deletar produto:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para atualizar um produto
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/produto/${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: editedName, descricao: editedDesc }),
            });
            if (!response.ok) {
                throw new Error("Falha ao atualizar o produto.");
            }

            // Fecha o modal de edição e atualiza a lista de produtos
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            setError(err.message);
            console.error("Erro ao atualizar produto:", err);
        } finally {
            setIsLoading(false);
        }
    }

    // --- FUNÇÕES AUXILIARES ---

    // Funções para controle de quantidade (apenas no frontend)
    const handleQuantityChange = (productId, amount) => {
        setProducts(products.map(p =>
            p.id === productId
                ? { ...p, quantity: Math.max(1, p.quantity + amount) }
                : p
        ));
    };

    // Funções para controlar o modal de edição
    const openEditModal = (product) => {
        setEditingProduct(product);
        setEditedName(product.nome);
        setEditedDesc(product.descricao);
    };

    const closeEditModal = () => {
        setEditingProduct(null);
    };


    // --- RENDERIZAÇÃO DO COMPONENTE ---
    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Gerenciador de Estoque</h1>
                    <p className="text-gray-600">Adicione, remova e edite os produtos da sua loja.</p>
                </header>

                {/* Seção para adicionar novo produto */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Adicionar Novo Produto</h2>
                    <form onSubmit={handleAddProduct} className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Nome do Produto"
                            value={newProductName}
                            onChange={(e) => setNewProductName(e.target.value)}
                            className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <input
                            type="text"
                            placeholder="Descrição do Produto"
                            value={newProductDesc}
                            onChange={(e) => setNewProductDesc(e.target.value)}
                            className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                        <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition flex items-center justify-center disabled:bg-blue-300">
                            {isLoading ? <SpinnerIcon /> : 'Adicionar'}
                        </button>
                    </form>
                </div>

                {/* Exibição de Erros */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">
                        <strong className="font-bold">Ocorreu um erro: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}


                {/* Seção da lista de produtos */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Lista de Produtos</h2>
                    {isLoading && products.length === 0 ? (
                        <p className="text-gray-500 text-center">Carregando produtos...</p>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow">
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-800">{product.nome}</h3>
                                        <p className="text-gray-600 mb-4">{product.descricao}</p>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {/* Controle de Quantidade */}
                                        <div className="flex items-center justify-center gap-4">
                                            <button onClick={() => handleQuantityChange(product.id, -1)} className="bg-gray-200 h-8 w-8 rounded-full font-bold text-lg hover:bg-gray-300">-</button>
                                            <span className="text-xl font-semibold">{product.quantity}</span>
                                            <button onClick={() => handleQuantityChange(product.id, 1)} className="bg-gray-200 h-8 w-8 rounded-full font-bold text-lg hover:bg-gray-300">+</button>
                                        </div>
                                        {/* Botões de Ação */}
                                        <div className="flex justify-between gap-2">
                                            <button onClick={() => openEditModal(product)} className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition w-full">Editar</button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition w-full">Excluir</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">Nenhum produto cadastrado ainda.</p>
                    )}
                </div>

            </div>

            {/* Modal de Edição */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">Editar Produto</h2>
                        <form onSubmit={handleUpdateProduct}>
                            <div className="mb-4">
                                <label htmlFor="editName" className="block text-gray-700 font-medium mb-1">Nome</label>
                                <input
                                    id="editName"
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="editDesc" className="block text-gray-700 font-medium mb-1">Descrição</label>
                                <textarea
                                    id="editDesc"
                                    value={editedDesc}
                                    onChange={(e) => setEditedDesc(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={closeEditModal} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition">Cancelar</button>
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

