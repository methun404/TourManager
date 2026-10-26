<template>
  <div class="px-4 py-2 sm:px-6 animate-fade-in flex flex-col gap-5 pb-4">
    
    <!-- ===== SKELETON LOADER ===== -->
    <div v-if="isLoadingData" class="flex flex-col gap-4">
      <div class="bg-gradient-to-br from-slate-800 to-indigo-900 rounded-3xl p-5 shadow-xl h-44 flex flex-col justify-between">
        <SkeletonLoader widthClass="w-32" heightClass="h-4" class="bg-white/20" />
        <div class="grid grid-cols-2 gap-3 mt-4">
          <SkeletonLoader widthClass="w-full" heightClass="h-12" class="bg-white/10" />
          <SkeletonLoader widthClass="w-full" heightClass="h-12" class="bg-white/10" />
          <SkeletonLoader widthClass="w-full" heightClass="h-12" class="bg-white/10" />
          <SkeletonLoader widthClass="w-full" heightClass="h-12" class="bg-white/10" />
        </div>
      </div>
      <div class="flex gap-1">
        <SkeletonLoader widthClass="w-full" heightClass="h-10" class="rounded-xl flex-1" />
        <SkeletonLoader widthClass="w-full" heightClass="h-10" class="rounded-xl flex-1" />
        <SkeletonLoader widthClass="w-full" heightClass="h-10" class="rounded-xl flex-1" />
        <SkeletonLoader widthClass="w-full" heightClass="h-10" class="rounded-xl flex-1" />
      </div>
      <SkeletonLoader widthClass="w-full" heightClass="h-32" class="rounded-2xl" />
      <SkeletonLoader widthClass="w-full" heightClass="h-32" class="rounded-2xl" />
    </div>

    <template v-else>
      <!-- Admin Hero Stats -->
    <div class="relative bg-gradient-to-br from-slate-800 to-indigo-900 rounded-3xl p-5 text-white shadow-xl overflow-hidden">
      <div class="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white/5 blur-2xl"></div>
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-slate-300 text-xs font-bold uppercase tracking-wider">{{ tourStore.tourName }}</p>
            <p class="text-[10px] text-slate-400 mt-0.5">Admin Dashboard</p>
          </div>
          <div class="flex items-center gap-1.5 px-2.5 py-1 bg-amber-400/20 border border-amber-400/30 rounded-full">
            <ShieldCheck class="w-3.5 h-3.5 text-amber-400" />
            <span class="text-[10px] font-bold text-amber-300">ADMIN</span>
          </div>
        </div>

        <!-- 4 Stats Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white/10 rounded-2xl p-3">
            <p class="text-slate-300 text-[10px] uppercase font-bold mb-1">Total Contribution</p>
            <p class="text-xl font-extrabold">৳ {{ fmt(totalContributionsSum) }}</p>
          </div>
          <div class="bg-white/10 rounded-2xl p-3">
            <p class="text-slate-300 text-[10px] uppercase font-bold mb-1">Total Spent</p>
            <p class="text-xl font-extrabold text-red-300">৳ {{ fmt(expenseStore.totalGroupSpent) }}</p>
          </div>
          <div class="bg-white/10 rounded-2xl p-3">
            <p class="text-slate-300 text-[10px] uppercase font-bold mb-1">Balance Left</p>
            <p class="text-xl font-extrabold text-green-300">৳ {{ fmt(balance) }}</p>
          </div>
          <div class="bg-white/10 rounded-2xl p-3">
            <p class="text-slate-300 text-[10px] uppercase font-bold mb-1">Avg / Person</p>
            <p class="text-xl font-extrabold text-blue-200">৳ {{ fmt(avgShare) }}</p>
          </div>
        </div>

        <!-- Invite Code -->
        <div class="flex items-center gap-2 mt-4">
          <span class="text-slate-400 text-[10px] font-bold uppercase">Invite Code:</span>
          <button @click="copyCode" class="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-md text-xs font-bold tracking-widest hover:bg-white/20 transition-colors">
            {{ tourStore.inviteCode }} <Copy class="w-3 h-3" />
          </button>
          <span v-if="codeCopied" class="text-[10px] text-green-300 font-semibold">Copied!</span>
        </div>
      </div>
    </div>

    <!-- Pending Fund Requests Alert -->
    <button
      v-if="fundRequestStore.pendingRequests.length > 0"
      @click="activeTab = 'fund_requests'"
      class="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl hover:bg-amber-100 transition-colors w-full text-left"
    >
      <div class="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
        <BellRing class="w-4 h-4 text-white" />
      </div>
      <div class="flex-1">
        <p class="text-sm font-bold text-amber-800">{{ fundRequestStore.pendingRequests.length }} Pending Fund Request(s)</p>
        <p class="text-[10px] text-amber-600">Tap to review and approve/reject</p>
      </div>
      <ChevronRight class="w-4 h-4 text-amber-400" />
    </button>

    <!-- Pending Expense Requests Alert -->
    <button
      v-if="expenseRequestStore.pendingRequests.length > 0"
      @click="activeTab = 'expense_requests'"
      class="flex items-center gap-3 p-3.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors w-full text-left"
    >
      <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
        <Receipt class="w-4 h-4 text-white" />
      </div>
      <div class="flex-1">
        <p class="text-sm font-bold text-blue-800 dark:text-blue-400">{{ expenseRequestStore.pendingRequests.length }} Pending Expense Request(s)</p>
        <p class="text-[10px] text-blue-600 dark:text-blue-500">Tap to approve or reject expenses</p>
      </div>
      <ChevronRight class="w-4 h-4 text-blue-400 dark:text-blue-500" />
    </button>

    <!-- Pending Join Requests Alert -->
    <button
      v-if="joinRequestStore.pendingAdminRequests.length > 0"
      @click="activeTab = 'join_requests'"
      class="flex items-center gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors w-full text-left"
    >
      <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
        <UserCheck class="w-4 h-4 text-white" />
      </div>
      <div class="flex-1">
        <p class="text-sm font-bold text-emerald-800 dark:text-emerald-400">{{ joinRequestStore.pendingAdminRequests.length }} Pending Join Request(s)</p>
        <p class="text-[10px] text-emerald-600 dark:text-emerald-500">Tap to approve or reject members</p>
      </div>
      <ChevronRight class="w-4 h-4 text-emerald-400 dark:text-emerald-500" />
    </button>

    <!-- Tab Navigation -->
    <div class="flex gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-2xl overflow-x-auto transition-colors">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
        class="flex-1 py-2 text-[10px] font-bold rounded-xl transition-all whitespace-nowrap px-1"
        :class="activeTab === tab.key ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
        {{ tab.label }}
        <span v-if="tab.badge > 0"
          class="ml-0.5 inline-flex items-center justify-center w-4 h-4 bg-red-500 dark:bg-red-600 text-white text-[9px] font-bold rounded-full">
          {{ tab.badge }}
        </span>
      </button>
    </div>

    <!-- ===== TAB: MEMBERS ===== -->
    <div v-if="activeTab === 'members'" class="flex flex-col gap-3">
      <!-- Member Skeleton -->
      <div v-if="tourStore.isMembersLoading" class="flex flex-col gap-3">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div class="flex items-center gap-3 mb-3">
            <SkeletonLoader widthClass="w-10" heightClass="h-10" circle />
            <div class="flex-1 space-y-2">
              <SkeletonLoader widthClass="w-1/2" heightClass="h-3" />
              <SkeletonLoader widthClass="w-1/3" heightClass="h-2" />
            </div>
            <SkeletonLoader widthClass="w-12" heightClass="h-4" class="rounded-full" />
          </div>
          <div class="grid grid-cols-3 gap-2">
            <SkeletonLoader widthClass="w-full" heightClass="h-12" class="rounded-xl" />
            <SkeletonLoader widthClass="w-full" heightClass="h-12" class="rounded-xl" />
            <SkeletonLoader widthClass="w-full" heightClass="h-12" class="rounded-xl" />
          </div>
        </div>
      </div>

      <template v-else>
        <div v-for="member in tourStore.members" :key="member.uid"
        class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
        <!-- Member Header -->
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold uppercase overflow-hidden shrink-0">
            <img v-if="member.avatar" :src="member.avatar" class="w-full h-full object-cover">
            <span v-else>{{ member.name?.charAt(0) || 'U' }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-extrabold text-gray-800 dark:text-gray-100 truncate">{{ member.name }}</p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 truncate">{{ member.email || '' }}</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
            :class="member.role === 'admin' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'">
            {{ member.role }}
          </span>
        </div>

        <!-- Member Stats Row -->
        <div class="grid grid-cols-3 gap-2 mb-3">
          <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-2 text-center transition-colors">
            <p class="text-[9px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">Total Contribution</p>
            <p class="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
              <span v-if="tourStore.isAdmin(authStore.user.uid) || tourStore.showContributionAmounts">৳ {{ fmt(memberContribution(member.uid)) }}</span>
              <span v-else class="text-[10px] text-gray-400 dark:text-gray-500 italic">Hidden</span>
            </p>
          </div>
          <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-2 text-center transition-colors">
            <p class="text-[9px] text-red-500 dark:text-red-400 uppercase font-bold">Spent</p>
            <p class="text-sm font-extrabold text-red-600 dark:text-red-300">৳ {{ fmt(memberSpend(member.uid)) }}</p>
          </div>
          <div class="rounded-xl p-2 text-center transition-colors"
            :class="memberBalance(member.uid) >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'">
            <p class="text-[9px] uppercase font-bold" :class="memberBalance(member.uid) >= 0 ? 'text-blue-500 dark:text-blue-400' : 'text-orange-500 dark:text-orange-400'">Balance</p>
            <p class="text-sm font-extrabold" :class="memberBalance(member.uid) >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-600 dark:text-orange-300'">
              {{ memberBalance(member.uid) >= 0 ? '+' : '-' }}৳ {{ fmt(Math.abs(memberBalance(member.uid))) }}
            </p>
          </div>
        </div>

        <!-- Target Budget Status -->
        <div v-if="tourStore.targetBudgetPerMember > 0" class="mb-3 p-2.5 rounded-xl border flex items-center justify-between transition-colors"
          :class="memberContribution(member.uid) >= tourStore.targetBudgetPerMember ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'">
          <div class="flex items-center gap-2">
            <CheckCircle v-if="memberContribution(member.uid) >= tourStore.targetBudgetPerMember" class="w-3.5 h-3.5 text-emerald-500" />
            <AlertCircle v-else class="w-3.5 h-3.5 text-red-500" />
            <span class="text-[10px] font-bold uppercase tracking-wider" :class="memberContribution(member.uid) >= tourStore.targetBudgetPerMember ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'">
              Target: ৳{{ fmt(tourStore.targetBudgetPerMember) }}
            </span>
          </div>
          <span class="text-[11px] font-extrabold" :class="memberContribution(member.uid) >= tourStore.targetBudgetPerMember ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-400'">
            {{ memberContribution(member.uid) >= tourStore.targetBudgetPerMember ? 'Target Reached' : `Minus: ৳${fmt(tourStore.targetBudgetPerMember - memberContribution(member.uid))}` }}
          </span>
        </div>

        <!-- Admin Actions for Member -->
        <div class="flex gap-2">
          <button @click="openAddFundForMember(member)"
            class="flex-1 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors flex items-center justify-center gap-1.5">
            <Plus class="w-3.5 h-3.5" />
            Add Contribution
          </button>
          <!-- Pause / Resume -->
          <button v-if="!tourStore.isMemberPaused(member.uid)"
            @click="pauseMember(member)"
            :disabled="pauseLoading === member.uid"
            class="px-3 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-900/50 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors flex items-center justify-center"
            title="Pause Member">
            <Pause class="w-4 h-4" />
          </button>
          <button v-else
            @click="resumeMember(member)"
            :disabled="pauseLoading === member.uid"
            class="px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center"
            title="Resume Member">
            <Play class="w-4 h-4" />
          </button>
          <button v-if="member.uid !== authStore.user.uid" @click="removeMember(member)"
            class="px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors flex items-center justify-center"
            title="Remove Member">
            <UserMinus class="w-4 h-4" />
          </button>
        </div>
        <!-- Paused indicator -->
        <div v-if="tourStore.isMemberPaused(member.uid)" class="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <Pause class="w-3 h-3 text-amber-500" />
          <span class="text-[10px] font-bold text-amber-600 dark:text-amber-400">Paused — not included in new expense splits</span>
        </div>
      </div>
      </template>
    </div>

    <!-- ===== TAB: EXPENSES ===== -->
    <div v-else-if="activeTab === 'expenses'" class="flex flex-col gap-3">
      <!-- Category Summary -->
      <div class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
        <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Spending by Category</p>
        <div v-if="Object.keys(expenseStore.getCategorySummary).length === 0" class="text-xs text-gray-400 dark:text-gray-500 text-center py-3">No expenses yet.</div>
        <div v-for="(amount, cat) in expenseStore.getCategorySummary" :key="cat" class="mb-2">
          <div class="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
            <span class="capitalize">{{ cat }}</span>
            <span>৳ {{ fmt(amount) }}</span>
          </div>
          <div class="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 dark:bg-blue-400 rounded-full" :style="{ width: expenseStore.totalGroupSpent > 0 ? Math.min(100, (amount / expenseStore.totalGroupSpent) * 100) + '%' : '0%' }"></div>
          </div>
        </div>
      </div>

      <!-- All Expenses List -->
      <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">All Expenses ({{ expenseStore.groupExpenses.length }})</p>
      
      <!-- Expense Skeleton -->
      <div v-if="expenseStore.isLoading" class="flex flex-col gap-3">
        <div v-for="i in 3" :key="i" class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex justify-between items-center">
          <div class="space-y-2 flex-1">
            <SkeletonLoader widthClass="w-3/4" heightClass="h-4" />
            <SkeletonLoader widthClass="w-1/2" heightClass="h-2" />
          </div>
          <SkeletonLoader widthClass="w-16" heightClass="h-5" />
        </div>
      </div>

      <template v-else>
        <div v-if="expenseStore.groupExpenses.length === 0" class="flex flex-col items-center p-6 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl transition-colors">
          <Receipt class="w-7 h-7 text-gray-300 dark:text-slate-600 mb-2" />
          <p class="text-xs text-gray-500 dark:text-gray-400">No expenses recorded.</p>
        </div>
        <ExpenseItem v-for="e in expenseStore.groupExpenses" :key="e.id" :expense="e" @view-details="selectedExpense = e" />
      </template>
    </div>

    <!-- ===== TAB: CONTRIBUTIONS ===== -->
    <div v-else-if="activeTab === 'contributions'" class="flex flex-col gap-3">
      <!-- Total Collected -->
      <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex justify-between items-center transition-colors">
        <div>
          <p class="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Total Collected</p>
          <p class="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">৳ {{ fmt(contributionStore.grandTotal) }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs text-emerald-600 dark:text-emerald-500">{{ contributionStore.contributions.length }} transactions</p>
        </div>
      </div>

      <!-- Contribution Timeline -->
      <div v-if="contributionStore.isLoading" class="flex flex-col gap-3">
        <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm">
          <SkeletonLoader widthClass="w-10" heightClass="h-10" circle />
          <div class="flex-1 space-y-2">
            <SkeletonLoader widthClass="w-24" heightClass="h-3" />
            <SkeletonLoader widthClass="w-32" heightClass="h-2" />
          </div>
          <SkeletonLoader widthClass="w-16" heightClass="h-4" />
        </div>
      </div>

      <template v-else>
        <div v-if="contributionStore.contributions.filter(c => !c.isDeleted).length === 0" class="flex flex-col items-center p-6 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl transition-colors">
          <ArrowUpCircle class="w-7 h-7 text-gray-300 dark:text-slate-600 mb-2" />
          <p class="text-xs text-gray-500 dark:text-gray-400">No contributions yet.</p>
        </div>
        <div v-for="c in contributionStore.contributions.filter(c => !c.isDeleted)" :key="c.id"
        class="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm transition-colors">
        <div class="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
          <ArrowUpCircle class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ c.memberName }}</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 truncate">{{ c.note || 'No note' }} · {{ fmtDate(c.date) }}</p>
          <p v-if="c.editedAt" class="text-[10px] text-blue-400 dark:text-blue-500">Edited {{ fmtDate(c.editedAt) }}</p>
        </div>
        <span class="text-base font-extrabold text-emerald-600 dark:text-emerald-400">+৳ {{ fmt(c.amount) }}</span>
        <div class="flex gap-1">
          <button @click="openEditContrib(c)" class="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
            <Pencil class="w-3.5 h-3.5" />
          </button>
          <button @click="deleteContrib(c)" class="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      </template>
    </div>

    <!-- ===== TAB: FUND REQUESTS ===== -->
    <div v-else-if="activeTab === 'fund_requests'" class="flex flex-col gap-3">
      <div v-if="fundRequestStore.requests.length === 0" class="flex flex-col items-center p-6 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl transition-colors">
        <BellRing class="w-7 h-7 text-gray-300 dark:text-slate-600 mb-2" />
        <p class="text-xs text-gray-500 dark:text-gray-400">No fund requests yet.</p>
      </div>
      <div v-for="req in fundRequestStore.requests" :key="req.id"
        class="p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-colors"
        :class="{
          'border-amber-200 dark:border-amber-900/50 bg-amber-50/10 dark:bg-amber-900/10': req.status === 'pending',
          'border-emerald-200 dark:border-emerald-900/50': req.status === 'approved',
          'border-red-200 dark:border-red-900/50': req.status === 'rejected'
        }">
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="font-bold text-gray-800 dark:text-gray-100">{{ req.memberName }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">৳ {{ fmt(req.amount) }} · {{ fmtDate(req.createdAt) }}</p>
            <p v-if="req.note" class="text-xs text-gray-600 dark:text-gray-400 italic mt-0.5">"{{ req.note }}"</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
            :class="{
              'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400': req.status === 'pending',
              'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400': req.status === 'approved',
              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400': req.status === 'rejected'
            }">{{ req.status }}</span>
        </div>
        <div v-if="req.status === 'pending'" class="flex gap-2">
          <button @click="approveFundRequest(req)" :disabled="processingId === req.id"
            class="flex-1 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl disabled:opacity-50 hover:bg-emerald-700 flex justify-center items-center gap-1">
            <svg v-if="processingId === req.id" class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span v-else>✓ Approve</span>
          </button>
          <button @click="rejectFundRequest(req)" :disabled="processingId === req.id"
            class="flex-1 py-2 text-xs font-bold bg-red-500 text-white rounded-xl disabled:opacity-50 hover:bg-red-600 flex justify-center items-center gap-1">
            <svg v-if="processingId === req.id" class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span v-else>✗ Reject</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== TAB: EXPENSE REQUESTS ===== -->
    <div v-else-if="activeTab === 'expense_requests'" class="flex flex-col gap-3">
      <div v-if="expenseRequestStore.requests.length === 0" class="flex flex-col items-center p-6 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl transition-colors">
        <Receipt class="w-7 h-7 text-gray-300 dark:text-slate-600 mb-2" />
        <p class="text-xs text-gray-500 dark:text-gray-400">No expense requests yet.</p>
      </div>
      <div v-for="req in expenseRequestStore.requests" :key="req.id"
        class="p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-colors"
        :class="{
          'border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/10': req.status === 'pending',
          'border-emerald-200 dark:border-emerald-900/50': req.status === 'approved',
          'border-red-200 dark:border-red-900/50': req.status === 'rejected'
        }">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1 min-w-0">
            <p class="font-bold text-gray-800 dark:text-gray-100 truncate">{{ req.title }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ req.paidByName }} · {{ req.category }} · {{ fmtDate(req.createdAt) }}</p>
            <p class="text-sm font-extrabold text-gray-800 dark:text-gray-100 mt-0.5">৳ {{ fmt(req.amount) }}</p>
            <p v-if="req.note" class="text-xs text-gray-600 dark:text-gray-400 italic mt-0.5">"{{ req.note }}"</p>
          </div>
          <span class="ml-2 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
            :class="{
              'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400': req.status === 'pending',
              'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400': req.status === 'approved',
              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400': req.status === 'rejected'
            }">{{ req.status }}</span>
        </div>
        <div v-if="req.status === 'pending'" class="flex gap-2 mt-3">
          <button @click="approveExpenseRequest(req)" :disabled="processingExpenseId === req.id"
            class="flex-1 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl disabled:opacity-50 hover:bg-blue-700 flex justify-center items-center gap-1">
            <svg v-if="processingExpenseId === req.id" class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span v-else>✓ Approve</span>
          </button>
          <button @click="rejectExpenseRequest(req)" :disabled="processingExpenseId === req.id"
            class="flex-1 py-2 text-xs font-bold bg-red-500 text-white rounded-xl disabled:opacity-50 hover:bg-red-600 flex justify-center items-center gap-1">
            <svg v-if="processingExpenseId === req.id" class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span v-else>✗ Reject</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== TAB: JOIN REQUESTS ===== -->
    <div v-else-if="activeTab === 'join_requests'" class="flex flex-col gap-3">
      <div v-if="joinRequestStore.adminRequests.length === 0"
        class="flex flex-col items-center p-8 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl transition-colors">
        <UserCheck class="w-8 h-8 text-gray-300 dark:text-slate-600 mb-2" />
        <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">No join requests yet.</p>
        <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-1 text-center">Enable "Require Join Approval" in Settings to use this feature.</p>
      </div>

      <div v-for="req in joinRequestStore.adminRequests" :key="req.id"
        class="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold uppercase overflow-hidden shrink-0">
            <img v-if="req.userAvatar" :src="req.userAvatar" class="w-full h-full object-cover">
            <span v-else>{{ req.userName?.charAt(0) || 'U' }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-extrabold text-gray-800 dark:text-gray-100 truncate">{{ req.userName }}</p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ fmtDate(req.createdAt) }}</p>
          </div>
          <span class="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
            :class="{
              'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400': req.status === 'pending',
              'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400': req.status === 'approved',
              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400': req.status === 'rejected',
              'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400': req.status === 'cancelled',
            }">{{ req.status }}</span>
        </div>
        <div v-if="req.status === 'pending'" class="flex gap-2 mt-3">
          <button @click="handleApproveJoin(req)" :disabled="processingJoinId === req.id"
            class="flex-1 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl disabled:opacity-50 hover:bg-emerald-700 flex justify-center items-center gap-1 transition-colors">
            <svg v-if="processingJoinId === req.id" class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span v-else>✓ Approve</span>
          </button>
          <button @click="handleRejectJoin(req)" :disabled="processingJoinId === req.id"
            class="flex-1 py-2 text-xs font-bold bg-red-500 text-white rounded-xl disabled:opacity-50 hover:bg-red-600 flex justify-center items-center gap-1 transition-colors">
            <span>✗ Reject</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== TAB: GROUPS ===== -->
    <div v-else-if="activeTab === 'groups'" class="flex flex-col gap-3">
      <ExpenseGroupManager />
    </div>

    <!-- ===== TAB: TRANSFERS ===== -->
    <div v-else-if="activeTab === 'transfers'" class="flex flex-col gap-3">
      <div v-if="transferStore.transfers.length === 0" class="flex flex-col items-center p-6 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl transition-colors">
        <ArrowLeftRight class="w-7 h-7 text-gray-300 dark:text-slate-600 mb-2" />
        <p class="text-xs text-gray-500 dark:text-gray-400">No transfers yet.</p>
      </div>
      <div v-for="t in transferStore.transfers" :key="t.id"
        class="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm transition-colors"
        :class="t.status === 'pending' ? 'border-amber-200 dark:border-amber-900/50' : ''">
        <div class="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          <ArrowLeftRight class="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-gray-800 dark:text-gray-100">{{ t.fromMemberName }} → {{ t.toMemberName }}</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ t.note || 'No note' }} · {{ fmtDate(t.createdAt) }}</p>
        </div>
        <span class="text-sm font-extrabold text-blue-600 dark:text-blue-400">৳ {{ fmt(t.amount) }}</span>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
          :class="t.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : t.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'">{{ t.status }}</span>
        <div v-if="t.status === 'pending'" class="flex gap-1">
          <button @click="transferStore.approveTransfer(t.id)" class="px-2 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">✓</button>
          <button @click="transferStore.rejectTransfer(t.id)" class="px-2 py-1 text-[10px] font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">✗</button>
        </div>
      </div>
    </div>

    <!-- ===== MODAL: Add Fund for Member ===== -->
    <ActionModal :isOpen="!!selectedMember" :title="`Add Fund for ${selectedMember?.name?.split(' ')[0] || ''}`" @close="selectedMember = null">
      <form v-if="selectedMember" @submit.prevent="addFundForMember" class="flex flex-col gap-4">
        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl mb-1 transition-colors">
          <div class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold uppercase overflow-hidden">
            <img v-if="selectedMember.avatar" :src="selectedMember.avatar" class="w-full h-full object-cover">
            <span v-else>{{ selectedMember.name?.charAt(0) }}</span>
          </div>
          <div>
            <p class="font-bold text-sm text-gray-800 dark:text-gray-100">{{ selectedMember.name }}</p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400">Total so far: ৳ {{ fmt(contributionStore.contributionsByMember[selectedMember.uid] || 0) }}</p>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Amount (৳)</label>
          <input v-model.number="addFundAmount" type="number" required min="1" placeholder="0.00"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-lg font-bold text-gray-900 dark:text-gray-100 transition-colors">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Note</label>
          <input v-model="addFundNote" type="text" placeholder="e.g. Cash received on 30 April"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-sm text-gray-900 dark:text-gray-100 transition-colors">
        </div>
        <button type="submit" :disabled="addFundLoading"
          class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-60 flex justify-center items-center gap-2">
          <svg v-if="addFundLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span v-else>Confirm & Add to Budget</span>
        </button>
      </form>
    </ActionModal>

    <!-- Expense Details -->
    <ActionModal :isOpen="!!selectedExpense" :title="selectedExpense?.title || 'Details'" @close="selectedExpense = null">
      <div v-if="selectedExpense" class="flex flex-col gap-3">
        <div class="flex justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-sm text-gray-600 dark:text-gray-400">Amount</span>
          <span class="text-lg font-extrabold text-gray-900 dark:text-gray-100">৳ {{ fmt(selectedExpense.amount) }}</span>
        </div>
        <div class="flex justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-sm text-gray-600 dark:text-gray-400">Category</span>
          <span class="font-bold capitalize text-sm text-gray-900 dark:text-gray-100">{{ selectedExpense.category }}</span>
        </div>
        <div class="flex justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-sm text-gray-600 dark:text-gray-400">Paid By</span>
          <span class="font-bold text-sm text-gray-900 dark:text-gray-100">{{ selectedExpense.paidByName || 'Unknown' }}</span>
        </div>
        <div class="flex justify-between p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-sm text-gray-600 dark:text-gray-400">Date</span>
          <span class="font-bold text-sm text-gray-900 dark:text-gray-100">{{ fmtDate(selectedExpense.date || selectedExpense.createdAt) }}</span>
        </div>
        <div v-if="selectedExpense.note" class="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
          <span class="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase block mb-1">Note</span>
          <span class="text-sm text-gray-900 dark:text-gray-100">{{ selectedExpense.note }}</span>
        </div>
        <div class="flex gap-2">
          <button @click="openEditExpense(selectedExpense)" class="flex-1 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm rounded-xl border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-1.5">
            <Pencil class="w-3.5 h-3.5" /> Edit
          </button>
          <button @click="deleteExpense(selectedExpense)" class="flex-1 py-2.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-sm rounded-xl border border-red-100 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </ActionModal>

    <!-- ===== MODAL: Edit Expense ===== -->
    <ActionModal :isOpen="!!editingExpense" title="Edit Expense" @close="editingExpense = null">
      <div v-if="editingExpense" class="flex flex-col gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Title</label>
          <input v-model="editExpenseTitle" type="text" class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Amount (৳)</label>
          <input v-model.number="editExpenseAmount" type="number" min="1" class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none font-bold text-lg text-gray-900 dark:text-gray-100 focus:border-blue-500 transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Note</label>
          <input v-model="editExpenseNote" type="text" class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 transition-colors" />
        </div>
        <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-xs text-amber-700 dark:text-amber-400">⚠ Editing will be recorded in the audit log.</div>
        <button @click="saveEditExpense" :disabled="editExpenseLoading" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-60 flex justify-center items-center gap-2">
          <svg v-if="editExpenseLoading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </ActionModal>

    <!-- ===== MODAL: Edit Contribution ===== -->
    <ActionModal :isOpen="!!editingContrib" title="Edit Contribution" @close="editingContrib = null">
      <div v-if="editingContrib" class="flex flex-col gap-4">
        <p class="text-sm font-bold text-gray-800 dark:text-gray-100">{{ editingContrib.memberName }}</p>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Amount (৳)</label>
          <input v-model.number="editContribAmount" type="number" min="1" class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none font-bold text-lg text-gray-900 dark:text-gray-100 focus:border-blue-500 transition-colors" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Note</label>
          <input v-model="editContribNote" type="text" class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl outline-none text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 transition-colors" />
        </div>
        <button @click="saveEditContrib" :disabled="editContribLoading" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-60 flex justify-center items-center gap-2">
          <svg v-if="editContribLoading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </ActionModal>

    </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ShieldCheck, Plus, Receipt, ArrowUpCircle, BellRing, ChevronRight, Copy, UserCheck, UserMinus, Pause, Play, Pencil, Trash2, ArrowLeftRight, Users, CheckCircle, AlertCircle } from 'lucide-vue-next'
import { useTourStore } from '../stores/tourStore'
import { useExpenseStore } from '../stores/expenseStore'
import { useAuthStore } from '../stores/authStore'
import { useFundRequestStore } from '../stores/fundRequestStore'
import { useContributionStore } from '../stores/contributionStore'
import { useExpenseRequestStore } from '../stores/expenseRequestStore'
import { useToastStore } from '../stores/toastStore'
import { useJoinRequestStore } from '../stores/joinRequestStore'
import { useTransferStore } from '../stores/transferStore'
import { useAuditStore } from '../stores/auditStore'
import { firestore } from '../services/firebase'
import { doc, updateDoc, increment, addDoc, collection, runTransaction, deleteDoc, arrayRemove, writeBatch } from 'firebase/firestore'

import ExpenseItem from '../components/expenses/ExpenseItem.vue'
import ActionModal from '../components/common/ActionModal.vue'
import SkeletonLoader from '../components/common/SkeletonLoader.vue'
import ExpenseGroupManager from '../components/dashboard/ExpenseGroupManager.vue'

const tourStore = useTourStore()
const expenseStore = useExpenseStore()
const authStore = useAuthStore()
const fundRequestStore = useFundRequestStore()
const contributionStore = useContributionStore()
const expenseRequestStore = useExpenseRequestStore()
const toastStore = useToastStore()
const joinRequestStore = useJoinRequestStore()
const transferStore = useTransferStore()
const auditStore = useAuditStore()

if (tourStore.tourId) joinRequestStore.initAdminListener(tourStore.tourId)

const activeTab = ref('members')
const tabs = computed(() => [
  { key: 'members', label: 'Members', badge: 0 },
  { key: 'expenses', label: 'Expenses', badge: 0 },
  { key: 'contributions', label: 'Funds', badge: 0 },
  { key: 'groups', label: 'Groups', badge: 0 },
  { key: 'transfers', label: 'Transfers', badge: transferStore.pendingTransfers.length },
  { key: 'fund_requests', label: 'Fund Req', badge: fundRequestStore.pendingRequests.length },
  { key: 'expense_requests', label: 'Exp Req', badge: expenseRequestStore.pendingRequests.length },
  { key: 'join_requests', label: 'Join Req', badge: joinRequestStore.pendingAdminRequests.length },
])

const selectedMember = ref(null)
const selectedExpense = ref(null)
const addFundAmount = ref(null)
const addFundNote = ref('')
const addFundLoading = ref(false)
const processingId = ref(null)
const processingExpenseId = ref(null)
const processingJoinId = ref(null)
const codeCopied = ref(false)

// Combined loading state
const isLoadingData = computed(() => tourStore.isLoading)

// Active member UIDs (non-paused)
const activeMemberUids = computed(() => tourStore.activeMembers)

// Per member share (splitAmong-aware)
const memberShare = (uid) => expenseStore.getMemberShare(uid, activeMemberUids.value)

// Per member paid amount (group expenses they paid for)
const memberSpend = (uid) => expenseStore.getMemberPaidAmount(uid)

// Per member net transfer effect
const memberNetTransfer = (uid) => transferStore.netTransfer(uid)

// Per member total contribution: cash + pocket spend (non-admin) + net transfer received
const memberContribution = (uid) => {
  const cash = contributionStore.contributionsByMember[uid] || 0
  const isAdminMember = tourStore.currentTour?.adminId === uid
  const pocket = isAdminMember ? 0 : memberSpend(uid)
  const transferEffect = memberNetTransfer(uid)
  return cash + pocket + transferEffect
}

// Total contributions sum
const totalContributionsSum = computed(() => {
  return tourStore.members.reduce((sum, m) => sum + memberContribution(m.uid), 0)
})

const balance = computed(() => totalContributionsSum.value - expenseStore.totalGroupSpent)

// Per member balance: contribution - their share of expenses
const memberBalance = (uid) => memberContribution(uid) - memberShare(uid)

const avgShare = computed(() => {
  const count = activeMemberUids.value.length || 1
  return expenseStore.totalGroupSpent / count
})

const openAddFundForMember = (member) => {
  selectedMember.value = member
  addFundAmount.value = null
  addFundNote.value = ''
}

// Pause / Resume member
const pauseLoading = ref(null)
const pauseMember = async (member) => {
  if (!confirm(`Pause ${member.name}? They won't be included in future expense splits until resumed.`)) return
  pauseLoading.value = member.uid
  try {
    const bal = memberBalance(member.uid)
    await tourStore.pauseMember(member.uid, bal)
    toastStore.addToast(`${member.name} paused. Balance snapshot saved.`, 'info')
  } catch (err) {
    toastStore.addToast('Failed to pause member.', 'error')
  } finally {
    pauseLoading.value = null
  }
}

const resumeMember = async (member) => {
  pauseLoading.value = member.uid
  try {
    await tourStore.resumeMember(member.uid)
    toastStore.addToast(`${member.name} resumed — now included in expense splits.`, 'success')
  } catch (err) {
    toastStore.addToast('Failed to resume member.', 'error')
  } finally {
    pauseLoading.value = null
  }
}

// Edit expense
const editingExpense = ref(null)
const editExpenseTitle = ref('')
const editExpenseAmount = ref(null)
const editExpenseNote = ref('')
const editExpenseLoading = ref(false)

const openEditExpense = (expense) => {
  editingExpense.value = expense
  editExpenseTitle.value = expense.title
  editExpenseAmount.value = expense.amount
  editExpenseNote.value = expense.note || ''
  selectedExpense.value = null
}

const saveEditExpense = async () => {
  if (!editingExpense.value) return
  editExpenseLoading.value = true
  try {
    const before = { ...editingExpense.value }
    
    // Auto-append edit statement
    let finalNote = editExpenseNote.value
    if (before.amount !== Number(editExpenseAmount.value) || before.title !== editExpenseTitle.value) {
      let statement = `\n[Edited by Admin: `
      if (before.amount !== Number(editExpenseAmount.value)) {
        statement += `Amount changed from ৳${before.amount} to ৳${editExpenseAmount.value}`
      } else {
        statement += `Title changed]`
      }
      if (before.amount !== Number(editExpenseAmount.value) && before.title !== editExpenseTitle.value) {
         statement = `\n[Edited by Admin: Title & Amount changed (was ৳${before.amount})]`
      } else if (before.amount !== Number(editExpenseAmount.value)) {
         statement += `]`
      }
      
      if (!finalNote.includes('[Edited by Admin:')) {
        finalNote += statement
      }
    }

    await updateDoc(doc(firestore, 'expenses', editingExpense.value.id), {
      title: editExpenseTitle.value,
      amount: Number(editExpenseAmount.value),
      note: finalNote,
      editedAt: new Date().toISOString(),
      editedBy: authStore.user.uid,
    })
    await auditStore.writeLog({
      tourId: tourStore.tourId,
      action: 'edit',
      entityType: 'expense',
      entityId: editingExpense.value.id,
      changedBy: authStore.user.uid,
      changedByName: authStore.getUserName,
      before,
      after: { title: editExpenseTitle.value, amount: Number(editExpenseAmount.value), note: finalNote },
    })
    toastStore.addToast('Expense updated.', 'success')
    editingExpense.value = null
  } catch (err) {
    toastStore.addToast('Failed to update expense.', 'error')
  } finally {
    editExpenseLoading.value = false
  }
}

// Edit contribution
const editingContrib = ref(null)
const editContribAmount = ref(null)
const editContribNote = ref('')
const editContribLoading = ref(false)

const openEditContrib = (c) => {
  editingContrib.value = c
  editContribAmount.value = c.amount
  editContribNote.value = c.note || ''
}

const saveEditContrib = async () => {
  if (!editingContrib.value) return
  editContribLoading.value = true
  try {
    const diff = Number(editContribAmount.value) - editingContrib.value.amount
    const before = { ...editingContrib.value }
    
    // Auto-append edit statement
    let finalNote = editContribNote.value
    if (diff !== 0) {
      const statement = `\n[Edited by Admin: Amount changed from ৳${before.amount} to ৳${editContribAmount.value}]`
      if (!finalNote.includes('[Edited by Admin:')) {
        finalNote += statement
      }
    }

    const batch = writeBatch(firestore)
    batch.update(doc(firestore, 'contributions', editingContrib.value.id), {
      amount: Number(editContribAmount.value),
      note: finalNote,
      editedAt: new Date().toISOString(),
    })
    if (diff !== 0) {
      batch.update(doc(firestore, 'tours', tourStore.tourId), { budget: increment(diff) })
    }
    await batch.commit()
    await auditStore.writeLog({
      tourId: tourStore.tourId,
      action: 'edit',
      entityType: 'contribution',
      entityId: editingContrib.value.id,
      changedBy: authStore.user.uid,
      changedByName: authStore.getUserName,
      before,
      after: { amount: Number(editContribAmount.value), note: finalNote },
    })
    toastStore.addToast('Contribution updated.', 'success')
    editingContrib.value = null
  } catch (err) {
    toastStore.addToast('Failed to update contribution.', 'error')
  } finally {
    editContribLoading.value = false
  }
}

const deleteContrib = async (c) => {
  if (!confirm(`Delete this ৳${fmt(c.amount)} contribution from ${c.memberName}?`)) return
  try {
    const before = { ...c }
    const batch = writeBatch(firestore)
    batch.update(doc(firestore, 'contributions', c.id), { isDeleted: true, deletedAt: new Date().toISOString() })
    batch.update(doc(firestore, 'tours', tourStore.tourId), { budget: increment(-c.amount) })
    await batch.commit()
    await auditStore.writeLog({ tourId: tourStore.tourId, action: 'delete', entityType: 'contribution', entityId: c.id, changedBy: authStore.user.uid, changedByName: authStore.getUserName, before, after: null })
    toastStore.addToast('Contribution removed.', 'info')
  } catch (err) {
    toastStore.addToast('Failed to delete contribution.', 'error')
  }
}

const removeMemberLoading = ref(false)
const removeMember = async (member) => {
  if (confirm(`Are you sure you want to remove ${member.name} from this tour?`)) {
    removeMemberLoading.value = true
    try {
      const tourRef = doc(firestore, 'tours', tourStore.tourId)
      await updateDoc(tourRef, { members: arrayRemove(member.uid) })
      
      const userRef = doc(firestore, 'users', member.uid)
      await updateDoc(userRef, { currentTourId: null })
      
      toastStore.addToast(`${member.name} has been removed.`, 'success')
    } catch (err) {
      console.error('Failed to remove member:', err)
      toastStore.addToast('Failed to remove member.', 'error')
    } finally {
      removeMemberLoading.value = false
    }
  }
}

// Admin: add fund directly to member account AND update tour budget atomically
const addFundForMember = async () => {
  if (!addFundAmount.value || addFundAmount.value <= 0) return
  addFundLoading.value = true
  const amount = Number(addFundAmount.value)
  const member = selectedMember.value
  const note = addFundNote.value || 'Added by Admin'
  try {
    const isOffline = !navigator.onLine
    const tourRef = doc(firestore, "tours", tourStore.tourId)

    // Use runTransaction: atomically add contribution + increment tour budget
    const promise = runTransaction(firestore, async (transaction) => {
      // Add contribution record
      const contribRef = doc(collection(firestore, "contributions"))
      transaction.set(contribRef, {
        tourId: tourStore.tourId,
        memberId: member.uid,
        memberName: member.name,
        amount,
        note,
        addedBy: authStore.user.uid,
        addedByName: authStore.getUserName,
        date: new Date().toISOString()
      })
      // Increment tour total budget
      transaction.update(tourRef, { budget: increment(amount) })
    })

    selectedMember.value = null

    if (isOffline) {
      toastStore.addToast("Fund added locally (Offline). Will sync when online.", 'info')
    } else {
      await promise
      toastStore.addToast(`Added ৳${fmt(amount)} for ${member.name} — Budget updated!`, 'success')
    }
  } catch (err) {
    console.error("Add fund error:", err)
    toastStore.addToast("Failed to add fund.", 'error')
  } finally {
    addFundLoading.value = false
  }
}

// Approve fund request with transaction
const approveFundRequest = async (req) => {
  processingId.value = req.id
  try {
    const reqRef = doc(firestore, "fund_requests", req.id)
    const tourRef = doc(firestore, "tours", tourStore.tourId)
    await runTransaction(firestore, async (transaction) => {
      const reqSnap = await transaction.get(reqRef)
      if (reqSnap.data().status !== 'pending') throw new Error("Already processed")
      transaction.update(reqRef, { status: 'approved', processedAt: new Date().toISOString() })
      transaction.update(tourRef, { budget: increment(req.amount) })
    })
    await addDoc(collection(firestore, "contributions"), {
      tourId: tourStore.tourId,
      memberId: req.memberId,
      memberName: req.memberName,
      amount: req.amount,
      note: req.note || '',
      addedBy: authStore.user.uid,
      addedByName: authStore.getUserName + ' (Approved)',
      date: new Date().toISOString()
    })
    toastStore.addToast("Fund request approved", 'success')
  } catch (err) {
    console.error("Approve fund error:", err)
    toastStore.addToast("Could not approve fund request.", 'error')
  } finally {
    processingId.value = null
  }
}

const rejectFundRequest = async (req) => {
  processingId.value = req.id
  try {
    await updateDoc(doc(firestore, "fund_requests", req.id), {
      status: 'rejected',
      processedAt: new Date().toISOString()
    })
    toastStore.addToast("Fund request rejected", 'info')
  } catch (err) {
    console.error("Reject fund error:", err)
    toastStore.addToast("Could not reject request.", 'error')
  } finally {
    processingId.value = null
  }
}

// Approve expense request: move from expense_requests to expenses
const approveExpenseRequest = async (req) => {
  processingExpenseId.value = req.id
  try {
    const reqRef = doc(firestore, "expense_requests", req.id)
    await runTransaction(firestore, async (transaction) => {
      const snap = await transaction.get(reqRef)
      if (snap.data().status !== 'pending') throw new Error("Already processed")
      transaction.update(reqRef, { status: 'approved', processedAt: new Date().toISOString() })
    })
    // Add to actual expenses collection
    await addDoc(collection(firestore, "expenses"), {
      title: req.title,
      amount: req.amount,
      category: req.category,
      note: req.note || '',
      isPersonal: false,
      date: req.date,
      tourId: req.tourId,
      paidBy: req.paidBy,
      paidByName: req.paidByName,
      createdAt: new Date().toISOString(),
      approvedBy: authStore.user.uid,
      approvedByName: authStore.getUserName
    })
    toastStore.addToast("Expense approved & saved", 'success')
  } catch (err) {
    console.error("Approve expense error:", err)
    toastStore.addToast("Could not approve expense.", 'error')
  } finally {
    processingExpenseId.value = null
  }
}

const rejectExpenseRequest = async (req) => {
  processingExpenseId.value = req.id
  try {
    await updateDoc(doc(firestore, "expense_requests", req.id), {
      status: 'rejected',
      processedAt: new Date().toISOString()
    })
    toastStore.addToast("Expense request rejected", 'info')
  } catch (err) {
    console.error("Reject expense error:", err)
    toastStore.addToast("Could not reject request.", 'error')
  } finally {
    processingExpenseId.value = null
  }
}

const deleteExpense = async (expense) => {
  if (!confirm(`Delete "${expense.title}"?`)) return
  try {
    await deleteDoc(doc(firestore, "expenses", expense.id))
    selectedExpense.value = null
    toastStore.addToast("Expense deleted", 'success')
  } catch (err) {
    toastStore.addToast("Could not delete expense.", 'error')
  }
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(tourStore.inviteCode)
    codeCopied.value = true
    toastStore.addToast('Invite code copied to clipboard!', 'success')
    setTimeout(() => codeCopied.value = false, 2000)
  } catch (e) { toastStore.addToast('Code: ' + tourStore.inviteCode, 'info') }
}

const handleApproveJoin = async (req) => {
  processingJoinId.value = req.id
  try {
    await joinRequestStore.approveRequest(req)
    toastStore.addToast(`✓ ${req.userName} has been approved and joined the tour!`, 'success')
  } catch (err) {
    console.error('Approve join error:', err)
    toastStore.addToast('Could not approve request.', 'error')
  } finally {
    processingJoinId.value = null
  }
}

const handleRejectJoin = async (req) => {
  processingJoinId.value = req.id
  try {
    await joinRequestStore.rejectRequest(req.id)
    toastStore.addToast(`Request from ${req.userName} rejected.`, 'info')
  } catch (err) {
    console.error('Reject join error:', err)
    toastStore.addToast('Could not reject request.', 'error')
  } finally {
    processingJoinId.value = null
  }
}

const fmt = (n) => Number(n || 0).toLocaleString('en-IN')
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''

</script>

<style scoped>
@reference "tailwindcss";
.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; will-change: transform, opacity; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
