<template>
    <div class="card border rounded h-100">
        <RouterLink :to="{ name: 'article.preview', params: { id } }"
            class="text-decoration-none text-dark d-flex flex-column h-100">
            <img :src="thumbnail" alt="Thumbnail" class="card-img-top object-fit-cover" style="height: 180px;" />
            <div class="card-body d-flex flex-column p-3">
                <h5 class="card-title fw-bold text-truncate">
                    {{ title }}
                </h5>
                <p class="card-text text-muted text-justify mb-3 line-clamp-2">{{ content }}</p>

                <div class="mt-auto d-flex align-items-center gap-2">
                    <img :src="avatar" alt="Creator Avatar" class="rounded-circle" width="24" height="24" />
                    <span class="small text-secondary fw-medium">
                        {{ creatorName }}
                    </span>
                </div>
            </div>
        </RouterLink>
    </div>
</template>
<script setup>
const props = defineProps({
    id: { type: Number, required: true },
    title: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    content: { type: String, default: '' },
    avatar: { type: String, default: '' },
    creatorName: { type: String, default: '' },
})
</script>

