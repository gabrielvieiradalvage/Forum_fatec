// Configurações do seu projeto
const SUPABASE_URL = 'https://tcjjdznykunlyqczgcif.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZvsQqNXKlOAl9aYDMbNQSA_tSEOpTCL';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Carregar mensagens
async function carregarMensagens() {
    const { data, error } = await _supabase
        .from('comentarios')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erro ao carregar:", error);
        return;
    }
    renderizar(data);
}

// Mostrar na tela
function renderizar(mensagens) {
    const container = document.getElementById('lista-comentarios');
    container.innerHTML = '';

    mensagens.forEach(m => {
        const data = new Date(m.created_at).toLocaleString('pt-BR');
        const div = document.createElement('div');
        div.className = 'comentario-card';
        div.innerHTML = `
            <div class="meta-info">${data}</div>
            <strong>@${m.usuario}</strong>
            <p>${m.mensagem}</p>
            <button onclick="curtir(${m.id}, ${m.likes})" style="width:auto; padding:5px 10px; border-color:red; color:red">
                ❤ Determinação (${m.likes})
            </button>
        `;
        container.appendChild(div);
    });
}

// Postar (Atenção ao nome das colunas!)
async function postarNoSupabase() {
    const user = document.getElementById('nome-usuario').value;
    const msg = document.getElementById('texto-comentario').value;

    if(!user || !msg) return alert("Preencha os campos!");

    // IMPORTANTE: No Supabase, a coluna deve se chamar exatamente 'mensagem'
    const { error } = await _supabase
        .from('comentarios')
        .insert([{ usuario: user, mensagem: msg, likes: 0 }]);

    if(error) {
        alert("Erro ao postar: " + error.message);
    } else {
        document.getElementById('texto-comentario').value = '';
        carregarMensagens();
    }
}

// Sistema de Likes
async function curtir(id, likesAtuais) {
    const { error } = await _supabase
        .from('comentarios')
        .update({ likes: likesAtuais + 1 })
        .eq('id', id);

    if(!error) carregarMensagens();
}

carregarMensagens();
