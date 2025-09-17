import {createClient} from "@supabase/supabase-js";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {LoaderCircle} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";

const supabaseUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase =
    createClient(supabaseUrl, supabaseAnonKey)

export async function signInWithEmail(email, password) {
    return await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export function RequireSession(
{
    onGetUser = (user) => {}, children
}) {
    const nav = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!user) {
            supabase.auth.getUser().then(({data, error}) => {
                if (!error && data) {
                    setUser(data.user);
                    onGetUser(data.user);
                }
                else {
                    nav(`/login?no-session${location.href ? '&redirect=' + location.href : ''}`);
                }
            })
        }
    }, [location, nav, onGetUser, user]);

    if (user) {
        return children;
    }
    else {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <LoaderCircle className="animate-spin size-10" />
            </div>
        )
    }
}

const foodSelectString = `
id,
user_id:create_from,
date:target_date,
type:food_type,
food,
confirm
`;

export async function getFoodData(
    begin = null, end = null, limit = 100,
) {
    let ret = supabase.from('everlight_lunch').select(foodSelectString);
        if (begin) {
        ret = ret.gte('target_date', begin);
    }
    if (end) {
        ret = ret.lt('target_date', end);
    }
    ret = ret.order('target_date', { ascending: false });
    ret = ret.limit(limit);
    return await ret;
}

export function addFood(
    user, date, type, food, confirm
) {
    return supabase.from('everlight_lunch').insert({
        create_from: user.id,
        target_date: date,
        food_type: type,
        food: food,
        confirm: confirm,
    }).select(foodSelectString);
}

export function confirmFood(id) {
    return supabase.from('everlight_lunch')
        .update({ confirm: true })
        .eq('id', id);
}

