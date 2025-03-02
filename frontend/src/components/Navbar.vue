<template>
    <nav class="navbar">
        <div class="navbar-brand">
            <a class="navbar-item" href="#">
                Mini Kanban Board
            </a>
        </div>
        <div class="navbar-menu">
            <div class="navbar-start">
                <a class="navbar-item" href="#">
                    Home
                </a>
                <a class="navbar-item" href="#">
                    About
                </a>
            </div>
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <a class="button is-primary">
                            <strong>Sign up</strong>
                        </a>
                        <a class="button is-light">
                            Log in
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',
};
</script>

<style scoped>
.navbar {
    background-color: #00d1b2;
    padding: 1rem;
}
.navbar-item {
    color: white;
}
.button.is-primary {
    background-color: #3273dc;
    border-color: transparent;
}
.button.is-light {
    background-color: white;
    color: #3273dc;
}
</style>