// Supabase Configuration
const SUPABASE_URL = 'https://fgaxvouhswnsmvpzzwrt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYXh2b3Voc3duc212cHp6d3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5Mzk1NTcsImV4cCI6MjA4MzUxNTU1N30.AnsEBsyZD-sRhlLBhge61Be-sZ8qIYROCWp6HOL3WgU';

// Simple Supabase client (using fetch API)
const supabaseClient = {
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY,
    
    async request(table, method = 'GET', data = null, filters = {}) {
        let url = `${this.url}/rest/v1/${table}`;
        
        // Add filters as query parameters
        if (Object.keys(filters).length > 0) {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                params.append(key, `eq.${value}`);
            });
            url += '?' + params.toString();
        }
        
        const options = {
            method,
            headers: {
                'apikey': this.key,
                'Authorization': `Bearer ${this.key}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        };
        
        if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Request failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Supabase request error:', error);
            throw error;
        }
    },
    
    async select(table, filters = {}) {
        return this.request(table, 'GET', null, filters);
    },
    
    async insert(table, data) {
        return this.request(table, 'POST', data);
    },
    
    async update(table, filters, data) {
        // For update, we need to use PATCH with filters in URL
        let url = `${this.url}/rest/v1/${table}`;
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            params.append(key, `eq.${value}`);
        });
        url += '?' + params.toString();
        
        const options = {
            method: 'PATCH',
            headers: {
                'apikey': this.key,
                'Authorization': `Bearer ${this.key}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        };
        
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Update failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Supabase update error:', error);
            throw error;
        }
    },
    
    async delete(table, filters) {
        let url = `${this.url}/rest/v1/${table}`;
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            params.append(key, `eq.${value}`);
        });
        url += '?' + params.toString();
        
        const options = {
            method: 'DELETE',
            headers: {
                'apikey': this.key,
                'Authorization': `Bearer ${this.key}`,
                'Prefer': 'return=representation'
            }
        };
        
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Delete failed');
            }
            return await response.json();
        } catch (error) {
            console.error('Supabase delete error:', error);
            throw error;
        }
    }
};

// Hash password function (simple SHA-256, in production use bcrypt on backend)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
