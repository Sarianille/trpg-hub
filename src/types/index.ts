export type Game = {
    id: string
    user_id: string
    my_character: string
    other_characters: string[]
    is_my_turn: boolean
    updated_at: string
    tag: string | null
    posts_written_by_me: number
    note: string | null
    finished_at: string | null
}

