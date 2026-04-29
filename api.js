// 1. Configuração de conexão com o seu projeto específico
const SUPABASE_URL = 'https://tcjjdznykunlyqczgcif.supabase.co';
// USE APENAS A CHAVE PUBLISHABLE (ANON) AQUI!
const SUPABASE_KEY = 'sb_publishable_ZvsQqNXKlOAl9aYDMbNQSA_tSEOpTCL';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Função para carregar as mensagens do banco de dados
async function carregarMensagens() {
    const listaHTML = document.getElementById('lista-comentarios');
    
    const { data, error } = await _supabase
        .from('comentarios')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erro ao buscar dados:", error);
        listaHTML.innerHTML = "<p>Erro ao carregar mensagens do subsolo...</p>";
        return;
    }

    renderizar(data);
}

// 3. Função para exibir os comentários na tela
function renderizar(mensagens) {
    const container = document.getElementById('lista-comentarios');
    container.innerHTML = ''; // Limpa a lista antes de atualizar

    mensagens.forEach(m => {
        // Formata a data para o padrão brasileiro
        const dataFormatada = new Date(m.created_at).toLocaleString('pt-BR');
        
        const div = document.createElement('div');
        div.className = 'comentario-card';
        div.innerHTML = `
            <div class="meta-info" style="font-size: 11px; color: #888;">${dataFormatada}</div>
            <strong>@${m.usuario}</strong>
            <p>${m.mensagem}</p>
            <button class="btn-like" onclick="curtir(${m.id}, ${m.likes})" style="width: auto; border-color: #ff0000; color: #ff0000; padding: 5px 10px;">
                ❤ Determinação (${m.likes})
            </button>
        `;
        container.appendChild(div);
    });
}

// 4. Função para enviar um novo comentário
async function postarNoSupabase() {
    const user = document.getElementById('nome-usuario').value;
    const msg = document.getElementById('texto-comentario').value;

    if (!user || !msg) {
        alert("Você precisa de mais DETERMINAÇÃO (e preencher os campos)!");
        return;
    }

    const { error } = await _supabase
        .from('comentarios')
        .insert([{ usuario: user, mensagem: msg, likes: 0 }]);

    if (error) {
        alert("Erro ao enviar para o subsolo: " + error.message);
    } else {
        // Limpa os campos e recarrega a lista
        document.getElementById('nome-usuario').value = "";
        document.getElementById('texto-comentario').value = "";
        carregarMensagens();
    }
}

// 5. Função para aumentar os likes
async function curtir(id, likesAtuais) {
    const { error } = await _supabase
        .from('comentarios')
        .update({ likes: likesAtuais + 1 })
        .eq('id', id);

    if (!error) {
        carregarMensagens(); // Atualiza a tela com o novo número de likes
    }
}

// Inicia o sistema buscando as mensagens já existentes
carregarMensagens();
